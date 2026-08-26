const fs = require('fs');

function parseM3U(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n');
    let channels = [];
    let currentChannel = {};

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('#EXTINF:')) {
            // குழு அல்லது கேட்டகிரி பெயரைக் கண்டறிதல்
            let groupMatch = line.match(/group-title="([^"]+)"/);
            let nameMatch = line.match(/,(.+)$/);
            
            currentChannel.group = groupMatch ? groupMatch[1] : 'Others';
            currentChannel.name = nameMatch ? nameMatch[1] : 'Unknown Channel';
        } else if (line && !line.startsWith('#')) {
            currentChannel.url = line;
            channels.push(currentChannel);
            currentChannel = {};
        }
    });

    // கேட்டகிரி வாரியாக வகைப்படுத்துதல்
    let categorized = {};
    channels.forEach(ch => {
        if (!categorized[ch.group]) {
            categorized[ch.group] = [];
        }
        categorized[ch.group].push(ch);
    });

    return categorized;
}
