// создател sylent345 (s1lnt) github все дела .ком и т.д
// не пиздить код суки
const { app, BrowserWindow } = require('electron');
const RPC = require('discord-rpc');
const path = require('path');

let mainWindow;


// дискорд рпк ( егорка помидорка лох ^_^ )
async function updatePresence(rpc) {
    if (!rpc || !mainWindow) return;

    try {
        const trackInfo = await mainWindow.webContents.executeJavaScript(`
            (() => {
                const titleEl = document.querySelector('.playbackSoundBadge__titleLink');
                const artistEl = document.querySelector('.playbackSoundBadge__lightLink');
                const imageEl = document.querySelector('.playbackSoundBadge__avatar span');
                
                const timePassedEl = document.querySelector('.playbackTimeline__timePassed span:nth-child(2)');
                const durationEl = document.querySelector('.playbackTimeline__duration span:nth-child(2)');

                if (!titleEl || !artistEl) return null;

                const parseTime = (t) => {
                    const p = t.split(':').map(Number);
                    return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1];
                };

                const current = timePassedEl ? parseTime(timePassedEl.innerText) : 0;
                const total = durationEl ? parseTime(durationEl.innerText) : 0;
                const currentStr = timePassedEl ? timePassedEl.innerText : '0:00';
                const totalStr = durationEl ? durationEl.innerText : '0:00';

                const createBar = (curr, tot, cStr, tStr) => {
                    const size = 12; 
                    const progress = tot > 0 ? Math.round((size * curr) / tot) : 0;
                    const bar = '━'.repeat(progress) + '🔘' + '━'.repeat(Math.max(0, size - progress));
                    return cStr + ' ' + bar + ' ' + tStr;
                };

                let imageUrl = null;
                if (imageEl && imageEl.style.backgroundImage) {
                    let rawUrl = imageEl.style.backgroundImage.slice(5, -2);
                    imageUrl = rawUrl.replace(/-(?:large|t50x50|t120x120|t200x200|small)\\.jpg/i, '-t500x500.jpg');
                    if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
                }

                return {
                    title: titleEl.title || titleEl.innerText,
                    artist: artistEl.title || artistEl.innerText,
                    image: imageUrl,
                    fullProgressBar: createBar(current, total, currentStr, totalStr)
                };
            })()
        `);

        if (trackInfo && trackInfo.title) {
            rpc.setActivity({

                details: trackInfo.title.trim() + " — " + trackInfo.artist.trim(),

                state: trackInfo.fullProgressBar, 
                largeImageKey: trackInfo.image || 'logo',
                largeImageText: trackInfo.title,
                instance: false,
            });
        }
    } catch (err) {

    }
}


// окошко window 90% AI - translateeddddd sex man and man gachi muchi eeeeeeeee))))
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "SoundCloud by s1lnt",
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.loadURL('https://soundcloud.com');
    mainWindow.setMenuBarVisibility(false);

    mainWindow.on('page-title-updated', (e) => {
        e.preventDefault();
    });
}


// +++++++++++++++++++++++++++++++++++++++++++++++++++++ \\
// запуск ( егор если код читаешь, ты пидарас тупой <3 ) \\
// +++++++++++++++++++++++++++++++++++++++++++++++++++++ \\
const clientId = '1493275852568264834';
const rpc = new RPC.Client({ transport: 'ipc' });


const UPDATE_INTERVAL = 5000; // 5 секунд (sec, сек [ 90 % AI ] )

app.whenReady().then(() => {
    createWindow();

    rpc.on('ready', () => {
        updatePresence(rpc);
        setInterval(() => updatePresence(rpc), UPDATE_INTERVAL);
    });


    rpc.login({ clientId }).catch(console.error);
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});