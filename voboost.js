(function () {
    'use strict'

    if (window.plugin_voboost_ready) return
    window.plugin_voboost_ready = true

    var STORAGE_KEY = 'player_volume_boost'

    Lampa.Lang.add({
        voboost_title: {
            en: 'Volume boost',
            uk: 'Підсилення звуку (буст)'
        },
        voboost_descr: {
            en: 'Allows raising the volume above 100% for too quiet videos. Works only in the built-in player.',
            uk: 'Дозволяє підняти гучність вище 100% для надто тихих відео. Працює лише у вбудованому плеєрі.'
        },
        voboost_applied: {
            en: 'Volume',
            uk: 'Гучність'
        },
        voboost_conflict: {
            en: 'Volume boost does not work together with normalization. Disable audio normalization in the player settings.',
            uk: 'Буст звуку не працює разом з нормалізацією. Вимкніть нормалізацію звуку в налаштуваннях плеєра.'
        }
    })

    var audio_context = null
    var current = { video: null, source: null, gain: null }
    var notified_conflict = false

    var VALUES = {
        '100': '100%',
        '110': '110%',
        '125': '125%',
        '150': '150%',
        '175': '175%',
        '200': '200%',
        '250': '250%',
        '300': '300%',
        '400': '400%',
        '500': '500%'
    }

    function boostFactor() {
        var percent = parseInt(Lampa.Storage.get(STORAGE_KEY, '100'), 10) || 100

        return Math.max(1, percent / 100)
    }

    function boostPercent() {
        return Math.round(boostFactor() * 100)
    }

    function isMediaElement(video) {
        return video && (video.tagName === 'VIDEO' || video.tagName === 'AUDIO') && typeof video.canPlayType === 'function'
    }

    function ensureContext() {
        if (audio_context) return audio_context

        var Ctx = window.AudioContext || window.webkitAudioContext

        if (!Ctx) return null

        try {
            audio_context = new Ctx()
        }
        catch (e) {
            audio_context = null
        }

        return audio_context
    }

    function resumeContext() {
        if (audio_context && audio_context.state === 'suspended') {
            try { audio_context.resume() } catch (e) {}
        }
    }

    function warnConflict() {
        if (notified_conflict) return

        notified_conflict = true

        Lampa.Noty.show(Lampa.Lang.translate('voboost_conflict'))
    }

    function applyGain() {
        if (!current.gain) return

        resumeContext()

        current.gain.gain.value = boostFactor()
    }

    function attach(video) {
        if (boostFactor() <= 1) {
            if (current.gain && current.video === video) current.gain.gain.value = 1

            return
        }

        if (!isMediaElement(video)) return

        if (Lampa.Storage.field('player_normalization')) {
            warnConflict()

            return
        }

        if (video.__voboost) {
            current = { video: video, source: video.__voboost.source, gain: video.__voboost.gain }

            applyGain()

            return
        }

        var ctx = ensureContext()

        if (!ctx) return

        resumeContext()

        var source

        try {
            source = ctx.createMediaElementSource(video)
        }
        catch (e) {
            warnConflict()

            console.log('VoBoost', 'createMediaElementSource error:', e && e.message)

            return
        }

        var gain = ctx.createGain()

        source.connect(gain)
        gain.connect(ctx.destination)

        video.__voboost = { source: source, gain: gain }

        current = { video: video, source: source, gain: gain }

        applyGain()

        Lampa.Noty.show(Lampa.Lang.translate('voboost_applied') + ': ' + boostPercent() + '%')

        console.log('VoBoost', 'attached', boostPercent() + '%')
    }

    function onReady() {
        attach(Lampa.PlayerVideo.video())
    }

    function listen() {
        Lampa.PlayerVideo.listener.follow('canplay', onReady)
        Lampa.PlayerVideo.listener.follow('play', onReady)

        Lampa.Player.listener.follow('destroy', function () {
            try {
                if (current.source) current.source.disconnect()
                if (current.gain) current.gain.disconnect()
            }
            catch (e) {}

            if (current.video) delete current.video.__voboost

            current = { video: null, source: null, gain: null }
            notified_conflict = false
        })
    }

    function addSettings() {
        Lampa.SettingsApi.addParam({
            component: 'player',
            param: {
                name: STORAGE_KEY,
                type: 'select',
                values: VALUES,
                default: '100'
            },
            field: {
                name: Lampa.Lang.translate('voboost_title'),
                description: Lampa.Lang.translate('voboost_descr')
            },
            onChange: function () {
                applyGain()

                Lampa.Settings.update && Lampa.Settings.update()
            }
        })
    }

    addSettings()
    listen()
})()