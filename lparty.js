(function () {
    'use strict';

    if (window.LParty_plugin_started) {
        console.log('[LParty] Already running.');
        return;
    }
    window.LParty_plugin_started = true;

    var META = {
        name: 'LParty',
        version: '1.0.0',
        author: 'nrsua'
    };

    var _rawLang = (Lampa.Storage.get('language') || 'en').toLowerCase();
    var i18n = {
        uk: {
            menu_title: 'LParty',
            settings_title: 'LParty',
            param_name: 'Ім\'я користувача',
            param_name_descr: 'Як вас бачитимуть інші в кімнатах. Порожньо = ідентифікатор Лампи.',
            param_use_pwd: 'Використовувати пароль',
            param_use_pwd_descr: 'Запитувати пароль при створенні кімнати та підставляти у власні кімнати.',
            param_pwd: 'Пароль за замовчуванням',
            param_pwd_descr: 'Буде використано при створенні кімнат із паролем.',
            param_publish: 'Показувати кімнату в списку',
            param_publish_descr: 'Вимкніть, щоб до вашої кімнати можна було зайти лише за кодом.',
            param_relay: 'Адреса реле',
            param_relay_descr: 'WebSocket-реле. За замовчуванням wss://itty.ws/c/',
            head_title: 'LParty - список кімнат',
            create_btn: 'Створити кімнату за посиланням',
            join_code_btn: 'Увійти за кодом кімнати',
            full_card_btn: 'LParty - Дивитися з друзями',
            settings_open_rooms: 'Відкрити список кімнат',
            settings_open_rooms_descr: 'Показує список доступних кімнат і дозволяє створити свою',
            empty_list: 'Відкритих кімнат немає',
            searching: 'Пошук кімнат...',
            input_url: 'Посилання на потік (m3u8 / mp4)',
            input_room_name: 'Назва кімнати',
            input_password: 'Пароль кімнати',
            input_join_password: 'Введіть пароль кімнати',
            input_room_code: 'Код кімнати',
            connecting: 'Підключення...',
            create_fail: 'Не вдалося створити кімнату',
            create_ok: function (n) { return 'Кімнату "' + n + '" створено'; },
            room_code: function (c) { return 'Код кімнати: ' + c; },
            join_ok: function (n) { return 'Ви увійшли до кімнати "' + n + '"'; },
            no_room: 'Кімнату не знайдено або невірний пароль',
            no_stream: 'У цій кімнаті немає потоку',
            kicked: 'Ви увійшли до цієї кімнати з іншого пристрою',
            host_left: 'Хост покинув кімнату - перегляд завершено',
            net_err: 'Помилка мережі',
            need_url: 'Не задано посилання на потік',
            create_from_player: 'Поділитися останнім потоком',
            pending_share: 'Запустіть відтворення - кімнату буде створено автоматично',
            label_owner: 'Хост',
            label_members: 'Глядачів',
            badge_room: 'Кімната',
            badge_viewers: 'Глядачів',
            notice_joined: function (n) { return n + ' приєднався'; },
            notice_left: function (n) { return n + ' покинув кімнату'; },
            notice_paused: function (n) { return n + ' поставив паузу'; },
            notice_resumed: function (n) { return n + ' продовжив відтворення'; },
            notice_seeked: function (n) { return n + ' перемотав'; },
            notice_host_changed: function (n) { return 'Новий хост: ' + n; },
            player_create_descr: 'Створити кімнату на цей потік',
            already_in_room: function (n) { return 'Ви вже в кімнаті "' + n + '"'; }
        },
        en: {
            menu_title: 'LParty',
            settings_title: 'LParty',
            param_name: 'Display name',
            param_name_descr: 'How others see you in rooms. Empty = Lampa ID.',
            param_use_pwd: 'Use password',
            param_use_pwd_descr: 'Ask for password when creating a room and prefill your default.',
            param_pwd: 'Default password',
            param_pwd_descr: 'Used when creating password-protected rooms.',
            param_publish: 'List room publicly',
            param_publish_descr: 'Turn off to make your room reachable by code only.',
            param_relay: 'Relay address',
            param_relay_descr: 'WebSocket relay. Default is wss://itty.ws/c/',
            head_title: 'LParty - available rooms',
            create_btn: 'Create room from URL',
            join_code_btn: 'Join by room code',
            full_card_btn: 'LParty - Watch with friends',
            settings_open_rooms: 'Open room browser',
            settings_open_rooms_descr: 'Shows the list of available rooms and lets you create your own',
            empty_list: 'No open rooms',
            searching: 'Looking for rooms...',
            input_url: 'Stream URL (m3u8 / mp4)',
            input_room_name: 'Room name',
            input_password: 'Room password',
            input_join_password: 'Enter room password',
            input_room_code: 'Room code',
            connecting: 'Connecting...',
            create_fail: 'Failed to create room',
            create_ok: function (n) { return 'Room "' + n + '" created'; },
            room_code: function (c) { return 'Room code: ' + c; },
            join_ok: function (n) { return 'Joined room "' + n + '"'; },
            no_room: 'Room not found or wrong password',
            no_stream: 'This room has no stream',
            kicked: 'You joined this room from another device',
            host_left: 'Host left the room - session ended',
            net_err: 'Network error',
            need_url: 'Stream URL is empty',
            create_from_player: 'Share last stream',
            pending_share: 'Start playback - the room will be created automatically',
            label_owner: 'Host',
            label_members: 'Viewers',
            badge_room: 'Room',
            badge_viewers: 'Viewers',
            notice_joined: function (n) { return n + ' joined'; },
            notice_left: function (n) { return n + ' left the room'; },
            notice_paused: function (n) { return n + ' paused'; },
            notice_resumed: function (n) { return n + ' resumed playback'; },
            notice_seeked: function (n) { return n + ' seeked'; },
            notice_host_changed: function (n) { return 'New host: ' + n; },
            player_create_descr: 'Create a room for this stream',
            already_in_room: function (n) { return 'You are already in room "' + n + '"'; }
        },
        ru: {
            menu_title: 'LParty',
            settings_title: 'LParty',
            param_name: 'Имя пользователя',
            param_name_descr: 'Как вас будут видеть в комнатах. Пусто = идентификатор Лампы.',
            param_use_pwd: 'Использовать пароль',
            param_use_pwd_descr: 'Запрашивать пароль при создании комнаты и подставлять в свои комнаты.',
            param_pwd: 'Пароль по умолчанию',
            param_pwd_descr: 'Будет использоваться при создании комнат с паролем.',
            param_publish: 'Показывать комнату в списке',
            param_publish_descr: 'Выключите, чтобы в вашу комнату можно было войти только по коду.',
            param_relay: 'Адрес реле',
            param_relay_descr: 'WebSocket-реле. По умолчанию wss://itty.ws/c/',
            head_title: 'LParty - список комнат',
            create_btn: 'Создать комнату по ссылке',
            join_code_btn: 'Войти по коду комнаты',
            full_card_btn: 'LParty - Смотреть с друзьями',
            settings_open_rooms: 'Открыть список комнат',
            settings_open_rooms_descr: 'Показывает список доступных комнат и позволяет создать свою',
            empty_list: 'Открытых комнат нет',
            searching: 'Поиск комнат...',
            input_url: 'Ссылка на поток (m3u8 / mp4)',
            input_room_name: 'Название комнаты',
            input_password: 'Пароль комнаты',
            input_join_password: 'Введите пароль комнаты',
            input_room_code: 'Код комнаты',
            connecting: 'Подключение...',
            create_fail: 'Не удалось создать комнату',
            create_ok: function (n) { return 'Комната "' + n + '" создана'; },
            room_code: function (c) { return 'Код комнаты: ' + c; },
            join_ok: function (n) { return 'Вошли в комнату "' + n + '"'; },
            no_room: 'Комната не найдена или неверный пароль',
            no_stream: 'В этой комнате нет потока',
            kicked: 'Вы вошли в комнату с другого устройства',
            host_left: 'Хост покинул комнату - просмотр завершён',
            net_err: 'Ошибка сети',
            need_url: 'Не задана ссылка на поток',
            create_from_player: 'Поделиться последним потоком',
            pending_share: 'Запустите воспроизведение - комната будет создана автоматически',
            label_owner: 'Хост',
            label_members: 'Зрителей',
            badge_room: 'Комната',
            badge_viewers: 'Зрителей',
            notice_joined: function (n) { return n + ' присоединился'; },
            notice_left: function (n) { return n + ' покинул комнату'; },
            notice_paused: function (n) { return n + ' поставил паузу'; },
            notice_resumed: function (n) { return n + ' продолжил воспроизведение'; },
            notice_seeked: function (n) { return n + ' перемотал'; },
            notice_host_changed: function (n) { return 'Новый хост: ' + n; },
            player_create_descr: 'Создать комнату с этим потоком',
            already_in_room: function (n) { return 'Вы уже в комнате "' + n + '"'; }
        }
    };
    var T = i18n[_rawLang] || i18n['en'];

    var DEFAULT_RELAY = 'wss://itty.ws/c/';
    var LOBBY_CHANNEL = 'lparty-lobby-v1';
    var ROOM_PREFIX = 'lparty-r-';

    var LOBBY_COLLECT_MS = 1500;
    var JOIN_TIMEOUT_MS = 6000;
    var PING_INTERVAL_MS = 20000;
    var ECHO_TIMEOUT_MS = 30000;
    var RECONNECT_MS = 4000;

    var SYNC_HEARTBEAT_MS = 2000;
    var SYNC_TOLERANCE_S = 0.30;
    var SYNC_HARD_SEEK_S = 1.50;
    var SYNC_RATE_GAIN = 0.10;
    var SYNC_MAX_RATE_OFFSET = 0.10;
    var SYNC_RATE_RESET_MS = 4000;

    var pid = Lampa.Storage.get('lampac_unic_id', '');
    if (!pid) {
        pid = Lampa.Utils.uid(8).toLowerCase();
        Lampa.Storage.set('lampac_unic_id', pid);
    }

    function getDisplayName() {
        var custom = (Lampa.Storage.get('lparty_display_name', '') || '').toString().trim();
        return custom || pid;
    }
    function isUsePassword() {
        return Lampa.Storage.field('lparty_use_password') === true;
    }
    function getDefaultPassword() {
        return (Lampa.Storage.get('lparty_default_password', '') || '').toString();
    }
    function isPublish() {
        return Lampa.Storage.field('lparty_publish') !== false;
    }
    function getRelay() {
        var v = (Lampa.Storage.get('lparty_relay', '') || '').toString().trim();
        if (!v) v = DEFAULT_RELAY;
        if (v.charAt(v.length - 1) !== '/') v += '/';
        return v;
    }

    function safe(s) {
        return (s + '').replace(/[<>&"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; });
    }

    var SHA_K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    function sha256hex(str) {
        var msg = unescape(encodeURIComponent(str));
        var len = msg.length;
        var bitLen = len * 8;
        var blocks = (((len + 8) >> 6) + 1) * 16;
        var w = [];
        var i, j;

        for (i = 0; i < blocks; i++) w[i] = 0;
        for (i = 0; i < len; i++) w[i >> 2] |= (msg.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
        w[len >> 2] |= 0x80 << (24 - (len % 4) * 8);
        w[blocks - 1] = bitLen;

        var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
        var m = [];

        function rr(v, n) { return (v >>> n) | (v << (32 - n)); }

        for (i = 0; i < blocks; i += 16) {
            var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];

            for (j = 0; j < 64; j++) {
                if (j < 16) {
                    m[j] = w[i + j] | 0;
                } else {
                    var s0 = rr(m[j - 15], 7) ^ rr(m[j - 15], 18) ^ (m[j - 15] >>> 3);
                    var s1 = rr(m[j - 2], 17) ^ rr(m[j - 2], 19) ^ (m[j - 2] >>> 10);
                    m[j] = (m[j - 16] + s0 + m[j - 7] + s1) | 0;
                }
                var S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25);
                var ch = (e & f) ^ (~e & g);
                var t1 = (h + S1 + ch + SHA_K[j] + m[j]) | 0;
                var S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22);
                var mj = (a & b) ^ (a & c) ^ (b & c);
                var t2 = (S0 + mj) | 0;

                h = g; g = f; f = e;
                e = (d + t1) | 0;
                d = c; c = b; b = a;
                a = (t1 + t2) | 0;
            }

            H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
        }

        var out = '';
        for (i = 0; i < 8; i++) {
            for (j = 3; j >= 0; j--) {
                var byte = (H[i] >>> (j * 8)) & 0xff;
                out += (byte < 16 ? '0' : '') + byte.toString(16);
            }
        }
        return out;
    }

    function roomChannel(roomId, password) {
        return ROOM_PREFIX + sha256hex((roomId || '').toUpperCase() + '|' + (password || '')).substr(0, 24);
    }

    function newRoomId() {
        var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        var id = '';
        for (var i = 0; i < 6; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
        return id;
    }

    function Sock(opts) {
        var self = this;
        this.channel = opts.channel;
        this.alias = opts.alias || '';
        this.echo = !!opts.echo;
        this.onEvent = opts.onEvent || function () {};
        this.reconnect = !!opts.reconnect;
        this.ws = null;
        this.uid = null;
        this.members = [];
        this.closed = false;
        this.retryTimer = null;

        this.url = function () {
            var q = 'announce=true&list=true';
            if (self.echo) q += '&echo=true';
            if (self.alias) q += '&as=' + encodeURIComponent(self.alias);
            return getRelay() + encodeURIComponent(self.channel) + '?' + q;
        };

        this.open = function () {
            if (self.closed) return;
            if (self.ws && (self.ws.readyState === 0 || self.ws.readyState === 1)) return;

            try {
                self.ws = new WebSocket(self.url());
            } catch (err) {
                self.scheduleRetry();
                return;
            }

            self.ws.onopen = function () {
                self.onEvent({ kind: 'open' });
            };

            self.ws.onmessage = function (e) {
                var d;
                try { d = JSON.parse(e.data); } catch (err) { return; }
                if (!d) return;

                if (d.type === 'join') {
                    if (d.self) {
                        self.uid = d.uid;
                        self.members = [];
                        var list = d.users || [];
                        for (var i = 0; i < list.length; i++) {
                            self.members.push({ uid: list[i].uid, alias: list[i].alias || '' });
                        }
                        self.onEvent({ kind: 'ready', date: d.date, total: d.total, members: self.members });
                    } else {
                        if (!self.findMember(d.uid)) self.members.push({ uid: d.uid, alias: d.alias || '' });
                        self.onEvent({ kind: 'join', date: d.date, uid: d.uid, alias: d.alias || '', total: d.total });
                    }
                    return;
                }

                if (d.type === 'leave') {
                    for (var k = self.members.length - 1; k >= 0; k--) {
                        if (self.members[k].uid === d.uid) self.members.splice(k, 1);
                    }
                    self.onEvent({ kind: 'leave', date: d.date, uid: d.uid, alias: d.alias || '', total: d.total });
                    return;
                }

                if (d.type === 'error') {
                    console.log('[LParty] relay error:', d.message);
                    self.onEvent({ kind: 'error', date: d.date, text: d.message });
                    return;
                }

                if (d.message && typeof d.message === 'object') {
                    self.onEvent({
                        kind: 'msg',
                        date: d.date,
                        uid: d.uid,
                        alias: d.alias || '',
                        msg: d.message,
                        mine: d.uid === self.uid
                    });
                }
            };

            self.ws.onclose = function () {
                self.uid = null;
                self.members = [];
                self.onEvent({ kind: 'close' });
                self.scheduleRetry();
            };

            self.ws.onerror = function () {};
        };

        this.scheduleRetry = function () {
            if (!self.reconnect || self.closed) return;
            if (self.retryTimer) clearTimeout(self.retryTimer);
            self.retryTimer = setTimeout(function () {
                self.retryTimer = null;
                self.open();
            }, RECONNECT_MS);
        };

        this.findMember = function (uid) {
            for (var i = 0; i < self.members.length; i++) if (self.members[i].uid === uid) return self.members[i];
            return null;
        };

        this.alive = function () {
            return !!self.ws && self.ws.readyState === 1;
        };

        this.send = function (obj) {
            if (!self.alive()) return false;
            try {
                self.ws.send(JSON.stringify(obj));
                return true;
            } catch (err) {
                return false;
            }
        };

        this.close = function () {
            self.closed = true;
            if (self.retryTimer) { clearTimeout(self.retryTimer); self.retryTimer = null; }
            if (self.ws) {
                try { self.ws.close(); } catch (err) {}
                self.ws = null;
            }
        };
    }

    var room = null;
    var lobbyHost = null;
    var inRoom = false;
    var joining = false;
    var joinTimer = null;

    var currentRoomId = null;
    var currentRoomPassword = '';
    var currentRoomName = '';
    var currentRoomOwner = null;
    var currentRoomMeta = { title: '', poster: '', url: '', tmdb_id: 0, source: '', type: '' };

    var pidByUid = {};
    var episodeSwitchPending = false;

    var serverTimeOffset = 0;
    var pingSamples = [];
    var echoSeq = 0;
    var echoPending = {};
    var pingTimer = null;
    var watchdogTimer = null;

    var isSystemSyncing = false;
    var lastUserActionTime = 0;
    var initialSyncLock = false;
    var targetInitialState = null;
    var expectedState = { seek: -1, play: false, pause: false };

    var lastStreamUrl = null;
    var lastStreamTitle = null;
    var pendingShareCard = null;
    var lastViewedCard = null;

    function serverNow() { return Date.now() + serverTimeOffset; }

    function iAmHost() { return !!currentRoomOwner && currentRoomOwner === pid; }

    function memberCount() { return room ? room.members.length : 0; }

    function getTmdbId(card) {
        if (!card) return 0;
        return card.id || card.tmdb_id || 0;
    }

    function getCardPoster(card) {
        if (!card) return '';
        if (card.poster_path) return 'https://image.tmdb.org/t/p/w300' + card.poster_path;
        return card.img || card.background_image || '';
    }

    function expectedPositionNow(state, basePosition, atServerTime) {
        if (state !== 'playing' || !atServerTime || atServerTime <= 0) return basePosition;
        var elapsedSec = (serverNow() - atServerTime) / 1000;
        if (elapsedSec < 0 || elapsedSec > 3600) return basePosition;
        return basePosition + elapsedSec;
    }

    function roomSend(obj) {
        if (!room || !room.alive()) return;
        obj.u = pid;
        obj.k = ++echoSeq;
        echoPending[obj.k] = Date.now();
        room.send(obj);
    }

    function handleEcho(key, serverDate) {
        var t0 = echoPending[key];
        if (!t0) return;
        delete echoPending[key];

        var t1 = Date.now();
        var rtt = t1 - t0;
        var offset = (serverDate + rtt / 2) - t1;

        pingSamples.push({ offset: offset, rtt: rtt });
        if (pingSamples.length > 8) pingSamples.shift();

        var best = pingSamples[0];
        for (var i = 1; i < pingSamples.length; i++) if (pingSamples[i].rtt < best.rtt) best = pingSamples[i];
        serverTimeOffset = best.offset;
    }

    function startClockTimers() {
        stopClockTimers();
        pingTimer = setInterval(function () {
            if (room && room.alive()) roomSend({ t: 'ping' });
        }, PING_INTERVAL_MS);

        watchdogTimer = setInterval(function () {
            if (!room || !room.alive()) return;
            var now = Date.now();
            for (var key in echoPending) {
                if (!echoPending.hasOwnProperty(key)) continue;
                if (now - echoPending[key] > ECHO_TIMEOUT_MS) {
                    console.log('[LParty] echo watchdog timeout - forcing reconnect');
                    echoPending = {};
                    try { room.ws.close(); } catch (err) {}
                    return;
                }
            }
        }, 5000);
    }

    function stopClockTimers() {
        if (pingTimer) { clearInterval(pingTimer); pingTimer = null; }
        if (watchdogTimer) { clearInterval(watchdogTimer); watchdogTimer = null; }
    }

    function buildAd() {
        return {
            id: currentRoomId,
            name: currentRoomName,
            title: currentRoomMeta.title || '',
            poster: currentRoomMeta.poster || '',
            owner: getDisplayName(),
            members: memberCount(),
            pwd: currentRoomPassword ? 1 : 0,
            tmdb: currentRoomMeta.tmdb_id || 0,
            type: currentRoomMeta.type || 'movie'
        };
    }

    function startLobbyAgent() {
        stopLobbyAgent();
        if (!isPublish()) return;

        lobbyHost = new Sock({
            channel: LOBBY_CHANNEL,
            alias: '',
            echo: false,
            reconnect: true,
            onEvent: function (e) {
                if (e.kind !== 'msg' || e.mine) return;
                if (!e.msg || e.msg.t !== 'who') return;
                if (!inRoom || !currentRoomId) return;

                var ad = buildAd();
                setTimeout(function () {
                    if (lobbyHost && inRoom) lobbyHost.send({ t: 'ad', r: ad });
                }, Math.floor(Math.random() * 350) + 50);
            }
        });
        lobbyHost.open();
    }

    function stopLobbyAgent() {
        if (lobbyHost) {
            lobbyHost.close();
            lobbyHost = null;
        }
    }

    function discoverRooms(done) {
        var found = {};
        var finished = false;

        var probe = new Sock({
            channel: LOBBY_CHANNEL,
            alias: '',
            echo: false,
            reconnect: false,
            onEvent: function (e) {
                if (e.kind === 'ready') {
                    probe.send({ t: 'who' });
                    return;
                }
                if (e.kind === 'msg' && !e.mine && e.msg && e.msg.t === 'ad' && e.msg.r && e.msg.r.id) {
                    found[e.msg.r.id] = e.msg.r;
                }
            }
        });
        probe.open();

        setTimeout(function () {
            if (finished) return;
            finished = true;
            probe.close();

            var list = [];
            for (var id in found) if (found.hasOwnProperty(id)) list.push(found[id]);
            list.sort(function (a, b) { return (b.members || 0) - (a.members || 0); });
            done(list);
        }, LOBBY_COLLECT_MS);
    }

    function openRoomBrowser() {
        Lampa.Noty.show(T.searching);

        discoverRooms(function (rooms) {
            var items = [];

            items.push({ title: '<span style="color:#00e676">+ ' + T.create_btn + '</span>', action: 'create' });
            items.push({ title: '<span style="color:#64b5f6">#  ' + T.join_code_btn + '</span>', action: 'code' });

            for (var i = 0; i < rooms.length; i++) {
                var r = rooms[i];
                var lock = r.pwd ? ' &#128274;' : '';
                var line2 = safe(r.title || '') + ' &middot; ' + T.label_owner + ': ' + safe(r.owner || '') +
                    ' &middot; ' + T.label_members + ': ' + (r.members || 0);
                items.push({
                    title: '<b>' + safe(r.name || r.id) + '</b> <span style="opacity:.5">[' + safe(r.id) + ']</span>' + lock +
                        '<br><span style="opacity:.7;font-size:.85em">' + line2 + '</span>',
                    room: r
                });
            }

            if (rooms.length === 0) {
                items.push({ title: '<span style="opacity:.6">' + T.empty_list + '</span>', disabled: true });
            }

            Lampa.Select.show({
                title: T.head_title,
                items: items,
                onSelect: function (a) {
                    if (a.disabled) return;
                    if (a.action === 'create') return askCreateRoom();
                    if (a.action === 'code') return askRoomCode();
                    if (a.room) return tryJoinRoom(a.room);
                },
                onBack: function () { Lampa.Controller.toggle('content'); }
            });
        });
    }

    function askRoomCode() {
        Lampa.Input.edit({
            title: T.input_room_code,
            value: '',
            free: true,
            nosave: true
        }, function (val) {
            var id = (val || '').toString().trim().toUpperCase();
            if (!id) return;
            tryJoinRoom({ id: id, pwd: 1, name: id });
        });
    }

    function tryJoinRoom(r) {
        if (inRoom) {
            Lampa.Noty.show(T.already_in_room(currentRoomName || currentRoomId || ''));
            return;
        }

        if (!r.pwd) return joinRoom(r.id, '', r.name || r.id);

        var prefill = isUsePassword() ? getDefaultPassword() : '';
        Lampa.Input.edit({
            title: T.input_join_password,
            value: prefill,
            free: true,
            nosave: true
        }, function (val) {
            joinRoom(r.id, val || '', r.name || r.id);
        });
    }

    function resetRoomState() {
        stopClockTimers();

        $('.lparty-room-badge').remove();

        var vid = getVideo();
        if (vid) clearRateAdjust(vid);

        if (expectedSeekTimer) { clearTimeout(expectedSeekTimer); expectedSeekTimer = null; }
        expectedState = { seek: -1, play: false, pause: false };
        initialSyncLock = false;
        targetInitialState = null;
        isSystemSyncing = false;
        inRoom = false;
        joining = false;
        currentRoomId = null;
        currentRoomPassword = '';
        currentRoomName = '';
        currentRoomOwner = null;
        currentRoomMeta = { title: '', poster: '', url: '', tmdb_id: 0, source: '', type: '' };
        pidByUid = {};
        echoPending = {};
        pingSamples = [];
        episodeSwitchPending = false;

        if (joinTimer) { clearTimeout(joinTimer); joinTimer = null; }
    }

    function leaveRoom(sendBye) {
        if (room) {
            if (sendBye && room.alive()) roomSend({ t: 'bye' });
            room.close();
            room = null;
        }
        stopLobbyAgent();
        resetRoomState();
    }

    function connectRoom(roomId, password, onReady) {
        if (room) { room.close(); room = null; }

        currentRoomId = roomId;
        currentRoomPassword = password || '';

        room = new Sock({
            channel: roomChannel(roomId, password),
            alias: getDisplayName(),
            echo: true,
            reconnect: true,
            onEvent: onRoomEvent
        });
        room._onReady = onReady;
        room.open();
        startClockTimers();
    }

    function joinRoom(roomId, password, fallbackName) {
        Lampa.Noty.show(T.connecting);

        joining = true;
        currentRoomName = fallbackName || roomId;

        connectRoom(roomId, password, function (ev) {
            if (ev.total <= 1) {
                failJoin();
                return;
            }
            roomSend({ t: 'hello', n: getDisplayName() });
        });

        if (joinTimer) clearTimeout(joinTimer);
        joinTimer = setTimeout(failJoin, JOIN_TIMEOUT_MS);
    }

    function failJoin() {
        if (!joining) return;
        Lampa.Noty.show(T.no_room);
        leaveRoom(false);
    }

    function acceptRoomState(msg, atServerTime) {
        if (joinTimer) { clearTimeout(joinTimer); joinTimer = null; }
        joining = false;

        if (!msg.url) {
            Lampa.Noty.show(T.no_stream);
            leaveRoom(true);
            return;
        }

        inRoom = true;
        currentRoomName = msg.rn || currentRoomName;
        currentRoomOwner = msg.own || null;
        currentRoomMeta = {
            title: msg.ti || '',
            poster: msg.po || '',
            url: msg.url,
            tmdb_id: msg.tm || 0,
            source: msg.src || '',
            type: msg.ty || 'movie'
        };

        var roomState = msg.s === 'playing' ? 'playing' : 'paused';
        var roomPos = msg.p || 0;

        var needsInitialSync = roomState === 'playing' || roomPos > 0.5;

        initialSyncLock = needsInitialSync;
        targetInitialState = needsInitialSync ? {
            state: roomState,
            position: roomPos,
            atServerTime: atServerTime
        } : null;

        Lampa.Noty.show(T.join_ok(currentRoomName));

        Lampa.Player.play({
            url: currentRoomMeta.url,
            title: currentRoomMeta.title || currentRoomName,
            poster: currentRoomMeta.poster || ''
        });
    }

    function askCreateRoom() {
        if (lastStreamUrl) {
            Lampa.Select.show({
                title: T.create_btn,
                items: [
                    { title: T.create_from_player + ' (' + safe(lastStreamTitle || '') + ')', share: true },
                    { title: T.input_url, share: false }
                ],
                onSelect: function (a) {
                    if (a.share) askRoomDetails({ stream_url: lastStreamUrl, title: lastStreamTitle || '' });
                    else promptStreamUrl();
                },
                onBack: function () { Lampa.Controller.toggle('content'); }
            });
        } else {
            promptStreamUrl();
        }
    }

    function promptStreamUrl() {
        Lampa.Input.edit({
            title: T.input_url,
            value: '',
            free: true,
            nosave: true
        }, function (val) {
            if (!val) return Lampa.Noty.show(T.need_url);
            askRoomDetails({ stream_url: val, title: '' });
        });
    }

    function askRoomDetails(seed) {
        Lampa.Input.edit({
            title: T.input_room_name,
            value: seed.title || ('Room ' + Math.floor(Math.random() * 1000)),
            free: true,
            nosave: true
        }, function (name) {
            if (!name) name = 'Room';
            seed.name = name;

            if (isUsePassword()) {
                Lampa.Input.edit({
                    title: T.input_password,
                    value: getDefaultPassword(),
                    free: true,
                    nosave: true
                }, function (pwd) {
                    seed.password = pwd || '';
                    createRoom(seed, false);
                });
            } else {
                seed.password = '';
                createRoom(seed, false);
            }
        });
    }

    var createPending = false;
    function createRoom(seed, hostAlreadyPlaying) {
        if (createPending) return;
        if (inRoom) {
            Lampa.Noty.show(T.already_in_room(currentRoomName || currentRoomId || ''));
            return;
        }
        if (!seed.stream_url) {
            Lampa.Noty.show(T.need_url);
            return;
        }
        createPending = true;

        var id = newRoomId();

        currentRoomName = seed.name || ('Room-' + id);
        currentRoomOwner = pid;
        currentRoomMeta = {
            title: seed.title || '',
            poster: seed.poster || '',
            url: seed.stream_url,
            tmdb_id: seed.tmdb_id || 0,
            source: seed.source || '',
            type: seed.type || 'movie'
        };

        connectRoom(id, seed.password || '', function () {
            createPending = false;
            inRoom = true;
            joining = false;

            initialSyncLock = false;
            targetInitialState = null;

            startLobbyAgent();

            Lampa.Noty.show(T.create_ok(currentRoomName));
            setTimeout(function () { Lampa.Noty.show(T.room_code(id)); }, 1200);

            if (hostAlreadyPlaying) {
                var vid = getVideo();
                if (vid) roomSend({ t: 'sync', s: vid.paused ? 'paused' : 'playing', p: vid.currentTime || 0 });
            } else {
                Lampa.Player.play({
                    url: currentRoomMeta.url,
                    title: currentRoomMeta.title || currentRoomName,
                    poster: currentRoomMeta.poster || ''
                });
            }
        });

        setTimeout(function () {
            if (createPending) {
                createPending = false;
                Lampa.Noty.show(T.create_fail);
                leaveRoom(false);
            }
        }, JOIN_TIMEOUT_MS);
    }

    function autoCreateRoomFromPending(card, streamUrl) {
        var title = card.title || card.name || card.original_title || card.original_name || '';
        var type = (card.name || card.number_of_seasons || card.first_air_date) ? 'tv' : 'movie';

        var seed = {
            stream_url: streamUrl,
            title: title,
            poster: getCardPoster(card),
            tmdb_id: getTmdbId(card),
            source: card.source || 'tmdb',
            type: type,
            name: title || ('Room ' + Math.floor(Math.random() * 1000)),
            password: ''
        };

        if (isUsePassword()) {
            Lampa.Input.edit({
                title: T.input_password,
                value: getDefaultPassword(),
                free: true,
                nosave: true
            }, function (pwd) {
                seed.password = pwd || '';
                createRoom(seed, true);
            });
        } else {
            createRoom(seed, true);
        }
    }

    function onRoomEvent(e) {
        if (e.kind === 'ready') {
            echoPending = {};

            if (room && room._onReady) {
                var cb = room._onReady;
                room._onReady = null;
                cb(e);
                return;
            }

            if (inRoom) {
                roomSend({ t: 'hello', n: getDisplayName() });
                if (iAmHost()) sendHostState();
            }
            updateRoomBadge();
            return;
        }

        if (e.kind === 'close') {
            updateRoomBadge();
            return;
        }

        if (e.kind === 'join') {
            updateRoomBadge();
            return;
        }

        if (e.kind === 'leave') {
            onMemberLeave(e);
            return;
        }

        if (e.kind !== 'msg' || !e.msg) return;

        if (e.mine) {
            if (e.msg.k) handleEcho(e.msg.k, e.date);
            return;
        }

        var m = e.msg;
        if (m.u) pidByUid[e.uid] = m.u;

        if (m.u === pid && m.t === 'hello') {
            Lampa.Noty.show(T.kicked);
            leaveRoom(false);
            return;
        }

        if (m.t === 'hello') {
            if (!inRoom) return;
            Lampa.Noty.show(T.notice_joined(m.n || e.alias));
            setTimeout(function () {
                if (!inRoom) return;
                roomSend({ t: 'me', n: getDisplayName() });
                if (iAmHost()) sendHostState();
            }, Math.floor(Math.random() * 250) + 50);
            updateRoomBadge();
            return;
        }

        if (m.t === 'me') {
            updateRoomBadge();
            return;
        }

        if (m.t === 'state') {
            if (joining) acceptRoomState(m, e.date);
            return;
        }

        if (m.t === 'host') {
            currentRoomOwner = m.u;
            Lampa.Noty.show(T.notice_host_changed(m.n || e.alias));
            return;
        }

        if (m.t === 'url') {
            if (!inRoom || !m.url) return;
            if (currentRoomOwner && m.u !== currentRoomOwner) return;

            currentRoomMeta.url = m.url;
            currentRoomMeta.title = m.ti || currentRoomMeta.title;
            episodeSwitchPending = true;
            try {
                Lampa.Player.play({
                    url: m.url,
                    title: m.ti || currentRoomName,
                    poster: ''
                });
            } catch (err) {}
            return;
        }

        if (m.t === 'sync' || m.t === 'act') {
            if (!inRoom) return;

            if (m.t === 'act' && m.v) {
                var text = formatNotice(m.v, m.n || e.alias);
                if (text) Lampa.Noty.show(text);
            }

            var state = m.s === 'playing' ? 'playing' : 'paused';
            var position = m.p || 0;

            if (initialSyncLock) {
                targetInitialState = { state: state, position: position, atServerTime: e.date };
                return;
            }

            var vid = getVideo();
            if (!vid) return;

            if (Date.now() - lastUserActionTime < 2000) {
                sendSync(vid.paused ? 'paused' : 'playing', null);
                return;
            }

            isSystemSyncing = true;
            applySync(vid, state, position, e.date);
            setTimeout(function () { isSystemSyncing = false; }, 500);
            return;
        }

        if (m.t === 'bye') {
            updateRoomBadge();
            return;
        }
    }

    function sendHostState() {
        roomSend({
            t: 'state',
            rn: currentRoomName,
            own: currentRoomOwner || pid,
            url: currentRoomMeta.url,
            ti: currentRoomMeta.title,
            po: currentRoomMeta.poster,
            tm: currentRoomMeta.tmdb_id,
            src: currentRoomMeta.source,
            ty: currentRoomMeta.type,
            s: hostPlaybackState(),
            p: hostPlaybackPosition()
        });
    }

    function hostPlaybackState() {
        var vid = getVideo();
        if (!vid) return 'paused';
        return vid.paused ? 'paused' : 'playing';
    }

    function hostPlaybackPosition() {
        var vid = getVideo();
        return vid ? (vid.currentTime || 0) : 0;
    }

    function onMemberLeave(e) {
        if (!inRoom) {
            updateRoomBadge();
            return;
        }

        var leaverPid = pidByUid[e.uid];
        delete pidByUid[e.uid];

        Lampa.Noty.show(T.notice_left(e.alias || ''));
        updateRoomBadge();

        var hostGone = currentRoomOwner && leaverPid === currentRoomOwner;
        if (!hostGone) return;

        setTimeout(function () {
            if (!inRoom || !room) return;
            if (hostStillPresent()) return;

            var uids = [];
            for (var i = 0; i < room.members.length; i++) uids.push(room.members[i].uid);
            uids.sort();

            if (uids.length && uids[0] === room.uid) {
                currentRoomOwner = pid;
                roomSend({ t: 'host', n: getDisplayName() });
                Lampa.Noty.show(T.notice_host_changed(getDisplayName()));
                startLobbyAgent();
            }
        }, 500);
    }

    function hostStillPresent() {
        if (!currentRoomOwner) return false;
        if (currentRoomOwner === pid) return true;
        if (!room) return false;
        for (var i = 0; i < room.members.length; i++) {
            if (pidByUid[room.members[i].uid] === currentRoomOwner) return true;
        }
        return false;
    }

    function formatNotice(verb, who) {
        if (!who) return '';
        if (verb === 'joined') return T.notice_joined(who);
        if (verb === 'left') return T.notice_left(who);
        if (verb === 'paused') return T.notice_paused(who);
        if (verb === 'resumed' || verb === 'playing') return T.notice_resumed(who);
        if (verb === 'seeked') return T.notice_seeked(who);
        if (verb === 'host_changed') return T.notice_host_changed(who);
        return who + ' · ' + verb;
    }

    function getVideo() {
        var vid = null;
        if (typeof Lampa.PlayerVideo !== 'undefined' && Lampa.PlayerVideo.video) vid = Lampa.PlayerVideo.video();
        if (!vid) vid = document.querySelector('.player-video__display video') || document.querySelector('.player video') || document.querySelector('video');
        return vid;
    }

    function sendSync(state, verb) {
        if (!inRoom || initialSyncLock) return;
        var vid = getVideo();
        if (!vid) return;

        if (verb) {
            roomSend({ t: 'act', s: state, p: vid.currentTime || 0, v: verb, n: getDisplayName() });
        } else {
            roomSend({ t: 'sync', s: state, p: vid.currentTime || 0 });
        }
    }

    var expectedSeekTimer = null;

    function setExpectedSeek(pos) {
        expectedState.seek = pos;
        if (expectedSeekTimer) clearTimeout(expectedSeekTimer);
        expectedSeekTimer = setTimeout(function () {
            expectedSeekTimer = null;
            expectedState.seek = -1;
        }, 4000);
    }

    function clearExpectedSeek() {
        if (expectedSeekTimer) { clearTimeout(expectedSeekTimer); expectedSeekTimer = null; }
        expectedState.seek = -1;
    }

    function expectPlay() {
        expectedState.play = true;
        setTimeout(function () { expectedState.play = false; }, 500);
    }

    function expectPause() {
        expectedState.pause = true;
        setTimeout(function () { expectedState.pause = false; }, 500);
    }

    function clearRateAdjust(vid) {
        if (vid._lp_rate_timeout) { clearTimeout(vid._lp_rate_timeout); vid._lp_rate_timeout = null; }
        if (vid.playbackRate !== 1) vid.playbackRate = 1;
    }

    function applySync(vid, state, basePosition, atServerTime) {
        if (vid.currentTime === undefined) return;

        var expected = expectedPositionNow(state, basePosition, atServerTime);
        var diff = vid.currentTime - expected;
        var absDiff = Math.abs(diff);

        if (absDiff > SYNC_HARD_SEEK_S) {
            setExpectedSeek(expected);
            vid.currentTime = expected;
            clearRateAdjust(vid);
        } else if (absDiff > SYNC_TOLERANCE_S) {
            var raw = diff * SYNC_RATE_GAIN;
            var offset = Math.max(-SYNC_MAX_RATE_OFFSET, Math.min(SYNC_MAX_RATE_OFFSET, raw));
            var newRate = 1 - offset;
            if (Math.abs(vid.playbackRate - newRate) > 0.005) vid.playbackRate = newRate;
            if (vid._lp_rate_timeout) clearTimeout(vid._lp_rate_timeout);
            vid._lp_rate_timeout = setTimeout(function () {
                vid._lp_rate_timeout = null;
                if (vid.playbackRate !== 1) vid.playbackRate = 1;
            }, SYNC_RATE_RESET_MS);
        } else {
            clearRateAdjust(vid);
        }

        if (state === 'playing' && vid.paused) {
            expectPlay();
            if (typeof Lampa.PlayerVideo !== 'undefined' && Lampa.PlayerVideo.play) Lampa.PlayerVideo.play();
            else {
                var p = vid.play();
                if (p && p['catch']) p['catch'](function () { expectedState.play = false; });
            }
        } else if (state === 'paused' && !vid.paused) {
            expectPause();
            if (vid.playbackRate !== 1) vid.playbackRate = 1;
            if (typeof Lampa.PlayerVideo !== 'undefined' && Lampa.PlayerVideo.pause) Lampa.PlayerVideo.pause();
            else vid.pause();
        }
    }

    setInterval(function () {
        if (!inRoom) {
            $('.lparty-room-badge').remove();
            return;
        }
        var vid = getVideo();
        if (!vid) return;
        updateRoomBadge();

        if (vid._lp_hooked) return;
        vid._lp_hooked = true;

        var enforceInitial = function () {
            if (!initialSyncLock || !targetInitialState) return;
            var expected = expectedPositionNow(targetInitialState.state, targetInitialState.position, targetInitialState.atServerTime);
            if (Math.abs(vid.currentTime - expected) > 1) {
                setExpectedSeek(expected);
                vid.currentTime = expected;
            }
            if (targetInitialState.state === 'paused') {
                expectPause();
                if (typeof Lampa.PlayerVideo !== 'undefined' && Lampa.PlayerVideo.pause) Lampa.PlayerVideo.pause();
                else vid.pause();
            } else {
                expectPlay();
                if (typeof Lampa.PlayerVideo !== 'undefined' && Lampa.PlayerVideo.play) Lampa.PlayerVideo.play();
                else { var p = vid.play(); if (p && p['catch']) p['catch'](function () {}); }
            }
            if (!vid._lp_enforce_timeout) {
                vid._lp_enforce_timeout = setTimeout(function () {
                    vid._lp_enforce_timeout = null;
                    initialSyncLock = false;
                    targetInitialState = null;
                    expectedState.play = false;
                    expectedState.pause = false;
                }, 3000);
            }
        };

        if (vid.readyState >= 1) enforceInitial();
        else vid.addEventListener('loadedmetadata', enforceInitial);
        vid.addEventListener('canplay', enforceInitial);

        vid.addEventListener('waiting', function () { vid._lp_buffering = true; });
        vid.addEventListener('canplay', function () { vid._lp_buffering = false; });
        vid.addEventListener('playing', function () { vid._lp_buffering = false; });

        vid.addEventListener('play', function () {
            if (initialSyncLock) {
                if (targetInitialState && targetInitialState.state === 'paused') {
                    if (typeof Lampa.PlayerVideo !== 'undefined' && Lampa.PlayerVideo.pause) Lampa.PlayerVideo.pause();
                    else vid.pause();
                }
                return;
            }
            var wasExpected = expectedState.play;
            expectedState.play = false;
            if (wasExpected) return;
            if (vid._lp_buffer_paused) { vid._lp_buffer_paused = false; return; }
            lastUserActionTime = Date.now();
            sendSync('playing', 'resumed');
        });

        vid.addEventListener('pause', function () {
            if (vid._lp_rate_timeout) { clearTimeout(vid._lp_rate_timeout); vid._lp_rate_timeout = null; }
            vid.playbackRate = 1;
            if (initialSyncLock) return;
            var wasExpected = expectedState.pause;
            expectedState.pause = false;
            if (wasExpected) return;

            if (vid._lp_buffering || vid.readyState < 3) { vid._lp_buffer_paused = true; return; }
            lastUserActionTime = Date.now();
            sendSync('paused', 'paused');
        });

        vid.addEventListener('seeked', function () {
            if (!isSystemSyncing) {
                if (vid._lp_rate_timeout) { clearTimeout(vid._lp_rate_timeout); vid._lp_rate_timeout = null; }
                vid.playbackRate = 1;
            }
            if (initialSyncLock) {
                if (targetInitialState) {
                    var expected = expectedPositionNow(targetInitialState.state, targetInitialState.position, targetInitialState.atServerTime);
                    if (Math.abs(vid.currentTime - expected) > 1) {
                        setExpectedSeek(expected);
                        vid.currentTime = expected;
                    }
                }
                return;
            }
            if (isSystemSyncing) return;
            if (expectedState.seek !== -1) {
                if (Math.abs(vid.currentTime - expectedState.seek) < 1) {
                    clearExpectedSeek();
                    return;
                }
                vid.currentTime = expectedState.seek;
                return;
            }
            lastUserActionTime = Date.now();
            sendSync(vid.paused ? 'paused' : 'playing', 'seeked');
        });
    }, 1000);

    setInterval(function () {
        if (!inRoom || initialSyncLock || isSystemSyncing) return;
        if (expectedState.seek !== -1) return;
        var vid = getVideo();
        if (!vid || vid.paused) return;
        sendSync('playing', null);
    }, SYNC_HEARTBEAT_MS);

    var debugRefreshTimer = null;

    function buildDebugHtml() {
        var wsState = room && room.ws ? (['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][room.ws.readyState] || 'UNKNOWN') : 'NO_WS';
        var lastRtt = pingSamples.length ? pingSamples[pingSamples.length - 1].rtt : '-';
        var bestRtt = '-';
        for (var i = 0; i < pingSamples.length; i++) {
            if (bestRtt === '-' || pingSamples[i].rtt < bestRtt) bestRtt = pingSamples[i].rtt;
        }
        var pendingCount = 0;
        for (var k in echoPending) { if (echoPending.hasOwnProperty(k)) pendingCount++; }

        var pos = '-', bufRdy = '-';
        var vid = getVideo();
        if (vid) {
            pos = (vid.currentTime || 0).toFixed(2);
            bufRdy = vid.readyState + (vid._lp_buffering ? '*' : '');
        }

        return [
            '<div><b>Relay:</b> ' + safe(wsState) + '</div>',
            '<div><b>Room:</b> ' + safe(currentRoomId || '-') + (currentRoomPassword ? ' &#128274;' : '') + '</div>',
            '<div><b>Role:</b> ' + (iAmHost() ? 'host' : 'guest') + '</div>',
            '<div><b>Members:</b> ' + memberCount() + '</div>',
            '<div><b>Lobby:</b> ' + (lobbyHost && lobbyHost.alive() ? 'published' : 'off') + '</div>',
            '<div><b>Clock offset:</b> ' + Math.round(serverTimeOffset) + ' ms</div>',
            '<div><b>RTT last/best:</b> ' + lastRtt + ' / ' + bestRtt + ' ms</div>',
            '<div><b>Echo pending:</b> ' + pendingCount + '</div>',
            '<div><b>initialSyncLock:</b> ' + initialSyncLock + '</div>',
            '<div><b>Video:</b> ' + pos + ' s (ready ' + bufRdy + ')</div>'
        ].join('');
    }

    function updateRoomBadge() {
        if (!inRoom || !currentRoomId) return;

        var nameContainer = $('.player-info__name, .player-panel__name');
        if (nameContainer.length && !$('.lparty-room-badge').length) {
            var badge = $(
                '<div class="lparty-room-badge" style="position:relative;display:inline-block;margin-left:15px;padding:4px 12px;background:rgba(255,255,255,0.15);border-radius:6px;font-size:0.85em;color:#fff;cursor:pointer;">' +
                '<span class="lparty-room-badge-text"></span>' +
                '<div class="lparty-debug-panel" style="display:none;position:absolute;top:100%;left:0;margin-top:6px;padding:8px 12px;background:rgba(0,0,0,0.9);border:1px solid rgba(255,255,255,0.25);border-radius:6px;z-index:9999;white-space:nowrap;font-family:monospace;font-size:0.85em;line-height:1.5;text-align:left;color:#fff;"></div>' +
                '</div>'
            );
            badge.on('mouseenter', function () {
                var $p = $(this).find('.lparty-debug-panel');
                $p.html(buildDebugHtml()).css('display', 'block');
                if (debugRefreshTimer) clearInterval(debugRefreshTimer);
                debugRefreshTimer = setInterval(function () {
                    if ($p.is(':visible')) $p.html(buildDebugHtml());
                    else { clearInterval(debugRefreshTimer); debugRefreshTimer = null; }
                }, 500);
            });
            badge.on('mouseleave', function () {
                $(this).find('.lparty-debug-panel').css('display', 'none');
                if (debugRefreshTimer) { clearInterval(debugRefreshTimer); debugRefreshTimer = null; }
            });
            nameContainer.after(badge);
        }

        var $badge = $('.lparty-room-badge');
        if (!$badge.length) return;

        var ok = room && room.alive();
        var dotColor = ok ? '#00e676' : '#ff5252';
        var dot = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + dotColor + ';margin-right:8px;vertical-align:middle;"></span>';

        $badge.find('.lparty-room-badge-text').html(
            dot + T.badge_room + ': <b style="color:#00e676;">' + safe(currentRoomName || currentRoomId) + '</b> ' +
            '<span style="opacity:.6">[' + safe(currentRoomId) + ']</span> | ' +
            T.badge_viewers + ': <b>' + memberCount() + '</b>'
        );
    }

    var passwordParamItem = null;
    function updatePasswordVisibility() {
        if (passwordParamItem) passwordParamItem.toggleClass('hide', !isUsePassword());
    }

    function registerSettings() {
        if (!Lampa.SettingsApi) return;

        Lampa.SettingsApi.addComponent({
            component: 'lparty',
            name: T.settings_title,
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"></circle><path d="M10.5 9.5 L10.5 14.5 L15 12 Z" fill="currentColor" stroke="none"></path><circle cx="4" cy="4" r="1.8" fill="currentColor" stroke="none"></circle><circle cx="20" cy="4" r="1.8" fill="currentColor" stroke="none"></circle><circle cx="4" cy="20" r="1.8" fill="currentColor" stroke="none"></circle><circle cx="20" cy="20" r="1.8" fill="currentColor" stroke="none"></circle></svg>'
        });

        Lampa.SettingsApi.addParam({
            component: 'lparty',
            param: { name: 'lparty_meta', type: 'static' },
            field: {
                name: META.name + ' v' + META.version,
                description: 'Author: ' + META.author
            },
            onRender: function (item) {
                item.on('hover:enter', function () {});
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'lparty',
            param: { name: 'lparty_open_rooms', type: 'button' },
            field: { name: T.settings_open_rooms, description: T.settings_open_rooms_descr },
            onChange: function () { openRoomBrowser(); }
        });

        Lampa.SettingsApi.addParam({
            component: 'lparty',
            param: { name: 'lparty_display_name', type: 'input', values: '', default: '' },
            field: { name: T.param_name, description: T.param_name_descr }
        });

        Lampa.SettingsApi.addParam({
            component: 'lparty',
            param: { name: 'lparty_publish', type: 'trigger', default: true },
            field: { name: T.param_publish, description: T.param_publish_descr },
            onChange: function () {
                if (inRoom && iAmHost()) {
                    if (isPublish()) startLobbyAgent();
                    else stopLobbyAgent();
                }
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'lparty',
            param: { name: 'lparty_use_password', type: 'trigger', default: false },
            field: { name: T.param_use_pwd, description: T.param_use_pwd_descr },
            onChange: function () { updatePasswordVisibility(); }
        });

        Lampa.SettingsApi.addParam({
            component: 'lparty',
            param: { name: 'lparty_default_password', type: 'input', values: '', default: '' },
            field: { name: T.param_pwd, description: T.param_pwd_descr },
            onRender: function (item) {
                passwordParamItem = item;
                updatePasswordVisibility();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'lparty',
            param: { name: 'lparty_relay', type: 'input', values: '', default: DEFAULT_RELAY },
            field: { name: T.param_relay, description: T.param_relay_descr }
        });
    }

    Lampa.Listener.follow('app', function (e) {
        if (e.type !== 'ready' || window.LParty_head_added) return;
        if (!Lampa.Head || typeof Lampa.Head.addIcon !== 'function') return;
        window.LParty_head_added = true;

        var svg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"></circle><path d="M10.5 9.5 L10.5 14.5 L15 12 Z" fill="currentColor" stroke="none"></path><circle cx="4" cy="4" r="1.8" fill="currentColor" stroke="none"></circle><circle cx="20" cy="4" r="1.8" fill="currentColor" stroke="none"></circle><circle cx="4" cy="20" r="1.8" fill="currentColor" stroke="none"></circle><circle cx="20" cy="20" r="1.8" fill="currentColor" stroke="none"></circle></svg>';
        var btn = Lampa.Head.addIcon(svg, openRoomBrowser);
        if (btn && btn.attr) btn.attr('title', T.menu_title);
    });

    Lampa.Listener.follow('full', function (e) {
        if (e.type !== 'complite') return;

        var cardData = (e.data && e.data.movie) ||
            (e.object && e.object.activity && e.object.activity.object ? e.object.activity.object.item : null) ||
            (e.object && e.object.item);
        if (!cardData) return;

        lastViewedCard = cardData;
    });

    function onPlayerStart(e) {
        if (!e || !e.url) return;
        lastStreamUrl = e.url;
        lastStreamTitle = (e.movie && (e.movie.title || e.movie.name)) || e.title || '';

        if (episodeSwitchPending && inRoom) {
            episodeSwitchPending = false;
            if (iAmHost()) {
                currentRoomMeta.url = e.url;
                currentRoomMeta.title = lastStreamTitle;
                roomSend({ t: 'url', url: e.url, ti: lastStreamTitle });
            }
            return;
        }

        if (pendingShareCard) {
            var card = pendingShareCard;
            pendingShareCard = null;
            autoCreateRoomFromPending(card, e.url);
        }
    }

    if (typeof Lampa.PlayerVideo !== 'undefined' && Lampa.PlayerVideo.listener) {
        Lampa.PlayerVideo.listener.follow('start', onPlayerStart);
    }

    if (typeof Lampa.Player !== 'undefined' && Lampa.Player.listener) {
        Lampa.Player.listener.follow('start', onPlayerStart);
        Lampa.Player.listener.follow('destroy', function () {
            var vid = getVideo();
            if (vid) {
                vid._lp_hooked = false;
                clearRateAdjust(vid);
            }
            if (episodeSwitchPending) return;
            leaveRoom(true);
        });
    }

    if (typeof Lampa.PlayerPlaylist !== 'undefined' && Lampa.PlayerPlaylist.listener && Lampa.PlayerPlaylist.listener.follow) {
        Lampa.PlayerPlaylist.listener.follow('select', function () {
            if (inRoom && iAmHost()) episodeSwitchPending = true;
        });
    }

    window.addEventListener('beforeunload', function () {
        if (inRoom) leaveRoom(true);
    });

    function createRoomFromPlayer() {
        if (inRoom) {
            Lampa.Noty.show(T.already_in_room(currentRoomName || currentRoomId || ''));
            return;
        }
        if (!lastStreamUrl) {
            Lampa.Noty.show(T.need_url);
            return;
        }
        try {
            if (typeof Lampa.Controller !== 'undefined' && Lampa.Controller.toggle) {
                var isMobile = Lampa.Platform && Lampa.Platform.screen && Lampa.Platform.screen('mobile');
                Lampa.Controller.toggle(isMobile ? 'player' : 'player_panel');
            }
        } catch (err) {}
        autoCreateRoomFromPending(lastViewedCard || {}, lastStreamUrl);
    }

    if (typeof Lampa.Select !== 'undefined' && Lampa.Select.listener && Lampa.Select.listener.follow) {
        Lampa.Select.listener.follow('preshow', function (e) {
            if (!e || !e.active || !Array.isArray(e.active.items)) return;

            var items = e.active.items;
            var hasPlayer = false, hasFileMenu = false, isPlayerSettings = false, alreadyInjected = false;

            for (var i = 0; i < items.length; i++) {
                var it = items[i];
                if (!it) continue;
                if (it.player) hasPlayer = true;
                if (it.mark || it.timeclear || it.clearmark) hasFileMenu = true;
                if (it.method === 'size' || it.method === 'speed' || it.method === 'subs' || it.method === 'share' || it.method === 'segments') isPlayerSettings = true;
                if (it.lparty_inject || it.lparty_inject_player) alreadyInjected = true;
            }
            if (alreadyInjected) return;

            if (hasPlayer && hasFileMenu) {
                items.push({
                    title: T.full_card_btn,
                    player: 'lampa',
                    lparty_inject: true
                });

                var originalOnSelect = e.active.onSelect;
                e.active.onSelect = function (a) {
                    if (a && a.lparty_inject) {
                        pendingShareCard = lastViewedCard || {};
                        Lampa.Noty.show(T.pending_share);
                    }
                    if (originalOnSelect) originalOnSelect(a);
                };
                return;
            }

            if (isPlayerSettings) {
                items.push({
                    title: T.full_card_btn,
                    subtitle: T.player_create_descr,
                    method: 'lparty_create',
                    lparty_inject_player: true
                });

                var originalOnSelectP = e.active.onSelect;
                e.active.onSelect = function (a) {
                    if (a && a.lparty_inject_player) {
                        createRoomFromPlayer();
                        return;
                    }
                    if (originalOnSelectP) originalOnSelectP(a);
                };
            }
        });
    }

    registerSettings();
    console.log('[LParty] started, relay:', getRelay(), 'lang:', _rawLang);
})();