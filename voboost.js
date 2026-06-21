(function () {
    'use strict'

    if (window.plugin_voboost_ready) return
    window.plugin_voboost_ready = true

    var STORAGE_KEY = 'player_volume_boost'

    var DEBUG_TOAST = false

    var ICON = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" style="margin-right:0.45em;vertical-align:-0.12em"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>'

    Lampa.Lang.add({
        voboost_title: {
            en: 'Volume boost',
            uk: 'Підсилення звуку (буст)'
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

    function storedPercent() {
        return String(parseInt(Lampa.Storage.get(STORAGE_KEY, '100'), 10) || 100)
    }

    function boostFactor() {
        return Math.max(1, (parseInt(storedPercent(), 10) || 100) / 100)
    }

    function boostPercent() {
        return parseInt(storedPercent(), 10) || 100
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

            return false
        }

        if (!isMediaElement(video)) return false

        if (Lampa.Storage.field('player_normalization')) {
            warnConflict()

            return false
        }

        if (video.__voboost) {
            current = { video: video, source: video.__voboost.source, gain: video.__voboost.gain }

            applyGain()

            return 'reused'
        }

        var ctx = ensureContext()

        if (!ctx) return false

        resumeContext()

        var source

        try {
            source = ctx.createMediaElementSource(video)
        }
        catch (e) {
            warnConflict()

            console.log('VoBoost', 'createMediaElementSource error:', e && e.message)

            return false
        }

        var gain = ctx.createGain()

        source.connect(gain)
        gain.connect(ctx.destination)

        video.__voboost = { source: source, gain: gain }

        current = { video: video, source: source, gain: gain }

        applyGain()

        console.log('VoBoost', 'attached', boostPercent() + '%')

        return 'created'
    }

    function onReady() {
        var video = Lampa.PlayerVideo.video()

        if (attach(video) === 'created') showToast()
    }

    var toast_el = null
    var toast_timer = null

    function showToast() {
        if (!toast_el) {
            toast_el = $('<div class="loading-layer hide"><div class="loading-layer__box"><div class="loading-layer__text"></div></div></div>')

            toast_el.css({ background: 'transparent', 'pointer-events': 'none' })
            toast_el.find('.loading-layer__box').css({ 'min-width': 'auto', 'justify-content': 'center', 'padding': '0.5em 1em' })
            toast_el.find('.loading-layer__text').css({ 'padding': 0, 'margin': 0, 'display': 'flex', 'flex-wrap': 'wrap', 'align-items': 'center', 'justify-content': 'center' })

            $('body').append(toast_el)
        }

        toast_el.find('.loading-layer__text').html(ICON + boostPercent() + '%')

        toast_el.removeClass('hide')

        clearTimeout(toast_timer)

        if (DEBUG_TOAST) return

        toast_timer = setTimeout(function () {
            toast_el.addClass('hide')
        }, 1300)
    }

    function backToPlayer() {
        Lampa.Controller.toggle(Lampa.Platform.screen('mobile') ? 'player' : 'player_panel')
    }

    function changeBoost(value) {
        Lampa.Storage.set(STORAGE_KEY, value)

        attach(Lampa.PlayerVideo.video())

        applyGain()

        showToast()
    }

    function openBoostSelect() {
        var selected = storedPercent()

        var items = Object.keys(VALUES).map(function (key) {
            return { title: VALUES[key], value: key, selected: key === selected }
        })

        Lampa.Select.show({
            title: Lampa.Lang.translate('voboost_title'),
            items: items,
            onBack: backToPlayer,
            onSelect: function (a) {
                changeBoost(a.value)

                backToPlayer()
            }
        })
    }

    function isPlayerSettings(active) {
        return active && active.nomark && active.items && active.title === Lampa.Lang.translate('title_settings') && Lampa.Player.opened && Lampa.Player.opened()
    }

    function listen() {
        Lampa.PlayerVideo.listener.follow('canplay', onReady)
        Lampa.PlayerVideo.listener.follow('play', onReady)

        Lampa.Select.listener.follow('preshow', function (e) {
            var active = e.active

            if (!isPlayerSettings(active)) return

            var exists = active.items.some(function (it) { return it.voboost })

            if (exists) return

            active.items.push({
                voboost: true,
                title: Lampa.Lang.translate('voboost_title'),
                subtitle: boostPercent() + '%',
                onSelect: openBoostSelect
            })
        })

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

    listen()
})()