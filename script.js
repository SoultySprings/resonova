/*
    Music Genre Galaxy
    Single-file interactive visualization with minimal CSS.
    Features:
     - nodes = genres, links = influences/subgenre relations
     - simple force simulation + repulsion
     - pan & zoom, hover tooltip, click to select
    */

const palettes = {
    midnightPurple: {
        '--bg': '#1a002b',
        '--bg-end': '#0d0014',
        '--panel': '#2f0d3d',
        '--muted': '#d8a0ff',
        '--accent': '#ffd0ff',
        '--accent-2': '#ff9eff',
        '--line': 'rgba(138, 112, 255, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#ff4aff',
        '--color-family': '#825d8c',
        '--color-subgenre': '#d8a0ff',
        '--color-artist': '#b032bf'
    },
    obsidian: {
        '--bg': '#0f0f0f',
        '--bg-end': '#070707',
        '--panel': '#1c1c1c',
        '--muted': '#b0b0b0',
        '--accent': '#66ffee',
        '--accent-2': '#00ffdd',
        '--line': 'rgba(0, 255, 221, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.1)',
        '--color-root': '#66ffee',
        '--color-family': '#6c6c6c',
        '--color-subgenre': '#b0b0b0',
        '--color-artist': '#00b3a0'
    },
    midnightBlue: {
        '--bg': '#0b0b1e',
        '--bg-end': '#040413',
        '--panel': '#1a1a33',
        '--muted': '#a0c0ff',
        '--accent': '#ffd27f',
        '--accent-2': '#ff8c42',
        '--line': 'rgba(106, 180, 255, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#ff8c42',
        '--color-family': '#5a5a80',
        '--color-subgenre': '#a0c0ff',
        '--color-artist': '#b35f30'
    },
    solarFlare: {
        '--bg': '#1b0b00',
        '--bg-end': '#0d0500',
        '--panel': '#331a0a',
        '--muted': '#ffd8b0',
        '--accent': '#fff0cc',
        '--accent-2': '#ffa347',
        '--line': 'rgba(255, 69, 0, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#ff4500',
        '--color-family': '#a05544',
        '--color-subgenre': '#ffd8b0',
        '--color-artist': '#b33400'
    },
    forestTwilight: {
        '--bg': '#0b1a0b',
        '--bg-end': '#041004',
        '--panel': '#1a331a',
        '--muted': '#a0ffc0',
        '--accent': '#b3ffcc',
        '--accent-2': '#00ff7f',
        '--line': 'rgba(0, 255, 127, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#00ff7f',
        '--color-family': '#558055',
        '--color-subgenre': '#a0ffc0',
        '--color-artist': '#009955'
    },
    crimsonNight: {
        '--bg': '#1f0a0a',
        '--bg-end': '#100505',
        '--panel': '#331a1a',
        '--muted': '#ffb0b0',
        '--accent': '#ffcccc',
        '--accent-2': '#ff667f',
        '--line': 'rgba(255, 0, 51, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#ff0033',
        '--color-family': '#995555',
        '--color-subgenre': '#ffb0b0',
        '--color-artist': '#990024'
    },
    icyCave: {
        '--bg': '#0a1f1f',
        '--bg-end': '#051010',
        '--panel': '#1a3333',
        '--muted': '#b0ffff',
        '--accent': '#ccffff',       // lightest
        '--accent-2': '#66ffff',    // slightly darker
        '--line': 'rgba(0, 255, 255, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#00ffff',  // darker than accent-2
        '--color-family': '#558080',
        '--color-subgenre': '#b0ffff',
        '--color-artist': '#009999' // darkest
    },
    sunsetGlow: {
        '--bg': '#1f0f0a',
        '--bg-end': '#100705',
        '--panel': '#331a1a',
        '--muted': '#ffc0a0',
        '--accent': '#ffd9b3',      // lightest
        '--accent-2': '#ffaa66',    // slightly darker
        '--line': 'rgba(255, 127, 0, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#ff7f00',  // darker than accent-2
        '--color-family': '#995533',
        '--color-subgenre': '#ffc0a0',
        '--color-artist': '#b35f00' // darkest
    },
    violetDream: {
        '--bg': '#0f001f',
        '--bg-end': '#07000f',
        '--panel': '#1c1a33',
        '--muted': '#d8b0ff',
        '--accent': '#f0ccff',      // lightest
        '--accent-2': '#d066ff',    // slightly darker
        '--line': 'rgba(170, 0, 255, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#aa00ff',  // darker than accent-2
        '--color-family': '#5a55a0',
        '--color-subgenre': '#d8b0ff',
        '--color-artist': '#660099' // darkest
    },
    emeraldDusk: {
        '--bg': '#001f0f',
        '--bg-end': '#000f07',
        '--panel': '#1a3331',
        '--muted': '#b0ffd8',
        '--accent': '#ccffeb',
        '--accent-2': '#66ffb3',
        '--line': 'rgba(0, 255, 136, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#00ff88',
        '--color-family': '#558080',
        '--color-subgenre': '#b0ffd8',
        '--color-artist': '#009955'
    },
    amberTwilight: {
        '--bg': '#1f1a0a',
        '--bg-end': '#100d05',
        '--panel': '#33311a',
        '--muted': '#fff0b0',
        '--accent': '#fff7cc',
        '--accent-2': '#ffd766',
        '--line': 'rgba(255, 191, 0, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#ffbf00',
        '--color-family': '#999955',
        '--color-subgenre': '#fff0b0',
        '--color-artist': '#b38f00'
    },
    sapphireMoon: {
        '--bg': '#0a0a1f',
        '--bg-end': '#05050f',
        '--panel': '#1a1a33',
        '--muted': '#b0c0ff',
        '--accent': '#99bbff',
        '--accent-2': '#6699ff',
        '--line': 'rgba(0, 68, 255, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#0044ff',
        '--color-family': '#5a5a80',
        '--color-subgenre': '#b0c0ff',
        '--color-artist': '#002b99'
    },
    roseQuartz: {
        '--bg': '#1f0a1a',
        '--bg-end': '#10050d',
        '--panel': '#331a33',
        '--muted': '#ffc0d8',
        '--accent': '#ffd0e6',
        '--accent-2': '#ff80b3',
        '--line': 'rgba(255, 51, 153, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#ff3399',
        '--color-family': '#995580',
        '--color-subgenre': '#ffc0d8',
        '--color-artist': '#b20066'
    },
    neonCity: {
        '--bg': '#0a0a0a',
        '--bg-end': '#050505',
        '--panel': '#1a1a1a',
        '--muted': '#39ff14',
        '--accent': '#9fff66',
        '--accent-2': '#ff9f1c',
        '--line': 'rgba(57, 255, 20, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#ff073a',
        '--color-family': '#6c6c6c',
        '--color-subgenre': '#39ff14',
        '--color-artist': '#990026'
    },
    cosmicRain: {
        '--bg': '#0d0f1a',
        '--bg-end': '#06070d',
        '--panel': '#1a1c33',
        '--muted': '#7fdbff',
        '--accent': '#b3e6ff',
        '--accent-2': '#ff85c1',
        '--line': 'rgba(127, 219, 255, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#ff2d95',
        '--color-family': '#5a5a80',
        '--color-subgenre': '#7fdbff',
        '--color-artist': '#990061'
    },
    lavaFlow: {
        '--bg': '#1f0a0a',
        '--bg-end': '#100505',
        '--panel': '#331a1a',
        '--muted': '#ffb3b3',
        '--accent': '#ffcc99',
        '--accent-2': '#ff9966',
        '--line': 'rgba(255, 51, 0, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#ff3300',
        '--color-family': '#995555',
        '--color-subgenre': '#ffb3b3',
        '--color-artist': '#990000'
    },
    auroraBorealis: {
        '--bg': '#001a0a',
        '--bg-end': '#000d05',
        '--panel': '#0a331a',
        '--muted': '#b0ffd8',
        '--accent': '#ccffee',
        '--accent-2': '#66ffcc',
        '--line': 'rgba(0, 255, 170, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#00ffaa',
        '--color-family': '#558080',
        '--color-subgenre': '#b0ffd8',
        '--color-artist': '#009977'
    },
    twilightOrchid: {
        '--bg': '#1a001f',
        '--bg-end': '#0d000f',
        '--panel': '#331a33',
        '--muted': '#e0b0ff',
        '--accent': '#f0ccff',
        '--accent-2': '#d066ff',
        '--line': 'rgba(170, 0, 255, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#aa00ff',
        '--color-family': '#9955a0',
        '--color-subgenre': '#e0b0ff',
        '--color-artist': '#660099'
    },
    desertDusk: {
        '--bg': '#1f1a0a',
        '--bg-end': '#100d05',
        '--panel': '#33311a',
        '--muted': '#fff0b0',
        '--accent': '#fff7cc',
        '--accent-2': '#ffd766',
        '--line': 'rgba(255, 191, 0, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#ffbf00',
        '--color-family': '#999955',
        '--color-subgenre': '#fff0b0',
        '--color-artist': '#b38f00'
    },
    sapphireNight: {
        '--bg': '#0a0a1f',
        '--bg-end': '#05050f',
        '--panel': '#1a1a33',
        '--muted': '#a0b0ff',
        '--accent': '#99bbff',
        '--accent-2': '#6680ff',
        '--line': 'rgba(0, 68, 255, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#0044ff',
        '--color-family': '#5a5a80',
        '--color-subgenre': '#a0b0ff',
        '--color-artist': '#002b99'
    },
    roseSunset: {
        '--bg': '#1f0a0f',
        '--bg-end': '#100507',
        '--panel': '#331a1a',
        '--muted': '#ffb0c0',
        '--accent': '#ffd0cc',
        '--accent-2': '#ff8099',
        '--line': 'rgba(255, 51, 102, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#ff3366',
        '--color-family': '#995555',
        '--color-subgenre': '#ffb0c0',
        '--color-artist': '#990033'
    },
    neonOcean: {
        '--bg': '#0a1a1f',
        '--bg-end': '#05100f',
        '--panel': '#1a3333',
        '--muted': '#00f0ff',
        '--accent': '#66ffff',
        '--accent-2': '#00ffff',
        '--line': 'rgba(0, 255, 255, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#00f0ff',
        '--color-family': '#558080',
        '--color-subgenre': '#00f0ff',
        '--color-artist': '#009999'
    },
    emberGlow: {
        '--bg': '#1f0a05',
        '--bg-end': '#100502',
        '--panel': '#331a0f',
        '--muted': '#ffdeb0',
        '--accent': '#fff4cc',
        '--accent-2': '#ffaa66',
        '--line': 'rgba(255, 85, 0, 0.2)',
        '--line-dashed': 'rgba(255, 255, 255, 0.15)',
        '--color-root': '#ff5500',
        '--color-family': '#995533',
        '--color-subgenre': '#ffdeb0',
        '--color-artist': '#b33400'
    }
};
// Live color preview for palette hover
const selectorsecond = document.getElementById('paletteSelector');
const preview = document.getElementById('colorPreview');

selectorsecond.addEventListener('mousemove', (e) => {
    // Find which <option> is under the cursor
    const option = document.elementFromPoint(e.clientX, e.clientY);

    // Check if it's a valid option
    if (option && option.tagName === 'OPTION') {
        const paletteKey = option.value;
        const currentPalette = palettes[paletteKey];

        if (!currentPalette) return; // Exit if the palette isn't found

        // --- THIS IS THE UPDATED LOGIC ---

        // 1. Set the preview background to the palette's background color
        preview.style.background = currentPalette['--bg'];

        // 2. Define which key colors you want to show in the preview
        const previewColors = ['--accent', '--accent-2', '--color-root', '--color-artist'];

        // 3. Build the HTML for the preview using a template literal
        preview.innerHTML = `
            <div style="color: ${currentPalette['--accent']}; margin-bottom: 5px; font-size: 13px;">
                ${option.textContent}
            </div>
        `;
    }
});

selectorsecond.addEventListener('mouseleave', () => {
    // Reset the preview area
    preview.style.background = 'transparent';
    preview.innerHTML = "Hover a palette to preview 🎨"; // Use innerHTML to clear the swatches
});

const selector = document.getElementById('paletteSelector');
selector.addEventListener('change', (e) => {
    const selected = palettes[e.target.value];
    for (const varName in selected) {
        document.documentElement.style.setProperty(varName, selected[varName]);
    }
}); const htmlRoot = document.getElementById('html-root');
const paletteSelector = document.getElementById('paletteSelector');


// Function to apply a palette
function applyPalette(name) {
    const palette = palettes[name];
    if (!palette) return;

    for (const key in palette) {
        htmlRoot.style.setProperty(key, palette[key]);
    }
}

// Load saved palette on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedPalette = localStorage.getItem('selectedPalette');
    if (savedPalette && palettes[savedPalette]) {
        applyPalette(savedPalette);
        paletteSelector.value = savedPalette; // optional: set dropdown
    }
});

// Change palette on selection
paletteSelector.addEventListener('change', (e) => {
    const selected = e.target.value;
    if (palettes[selected]) {
        applyPalette(selected);
        localStorage.setItem('selectedPalette', selected);
    }
});

async function loadMusic() {
    window.addEventListener('load', () => {
        const splash = document.getElementById('splash');
        const progressBar = document.getElementById('progressBar');

        // This logic works perfectly with the new CSS
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 0); // small delay to trigger transition

        setTimeout(() => {
            splash.classList.add('hidden'); // fade out
            setTimeout(() => splash.remove(), 4000);
        }, 4000);
    });
    try {
        const res = await fetch("http://localhost:5000/music");
        return await res.json();


    } catch (err) {
        console.error("Error loading data");
        //         document.body.innerHTML = `
        //         <div style="
        //     background: radial-gradient(circle at top, var(--bg), transparent 80%),
        //                 radial-gradient(circle at bottom, var(--bg), transparent 80%),
        //                 black;
        //     color: var(--accent);
        //     display: grid;
        //     place-items: center;
        //     height: 100vh;
        // ">

        //   <div style="text-align:center;">
        //   <h1>Database Connection Error</h1>
        //   <p>We were unable to connect to the database. Please try again later or contact support if the issue persists.</p>
        // </div>

        // </div>`;
    }
}


(async () => {

    const canvas = document.getElementById('galaxy');
    const ctx = canvas.getContext('2d', { alpha: true });
    const tooltip = document.getElementById('tooltip');
    const infoContent = document.getElementById('infoContent');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const resetBtn = document.getElementById('resetBtn');
    const toggleLabelsBtn = document.getElementById('toggleLabelsBtn');

    const data = await loadMusic();
    const rawNodes1 = data;
    console.log("rawNodes:", rawNodes1);

    // Sample dataset (small, extendable)
    const rawNodes = [
        // Root
        { id: "Music", type: "Root", pop: 1.0, meta: ["The universal art form of arranging sound in time to produce a composition through the elements of melody, harmony, rhythm, and timbre."] },

        // Families
        { id: "Rock", parent: "Music", type: "Family", pop: 1.0, meta: ["A broad genre of popular music that originated as 'rock and roll' in the United States in the late 1940s and early 1950s."] },
        { id: "Pop", parent: "Music", type: "Family", pop: 1.0, meta: ["Music of general appeal to the public, characterized by catchy melodies, relatable lyrics, and a focus on commercial success."] },
        { id: "Hip-Hop", parent: "Music", type: "Family", pop: 0.99, meta: ["A cultural movement and music genre developed in the 1970s by African Americans, featuring rhythmic and rhyming speech (rap)."] },
        { id: "R&B", parent: "Music", type: "Family", pop: 0.97, meta: ["Rhythm and Blues, a genre of popular music that originated in African-American communities in the 1940s."] },
        { id: "Electronic", parent: "Music", type: "Family", pop: 0.95, meta: ["A broad category of music produced using electronic instruments, synthesizers, and computer-based technology."] },
        { id: "Latin", parent: "Music", type: "Family", pop: 0.93, meta: ["A broad category of music genres from Latin America and the Iberian Peninsula, as well as from Latino communities in other countries."] },
        { id: "Country", parent: "Music", type: "Family", pop: 0.92, meta: ["A genre of popular music originating in the rural southern United States, characterized by ballads and dance tunes with simple forms and harmonies."] },
        { id: "Metal", parent: "Music", type: "Family", pop: 0.91, meta: ["A genre of rock music characterized by loud, aggressive rhythms, highly amplified distorted guitars, and powerful vocals."] },
        { id: "Soundtrack", parent: "Music", type: "Family", pop: 0.9, meta: ["Music recorded and used for motion pictures, television shows, and video games, encompassing a wide variety of musical styles."] },
        { id: "Reggae", parent: "Music", type: "Family", pop: 0.9, meta: ["A music genre that originated in Jamaica in the late 1960s, known for its offbeat rhythms, staccato chords, and connections to the Rastafari movement."] },
        { id: "Classical", parent: "Music", type: "Family", pop: 0.88, meta: ["Art music produced or rooted in the traditions of Western culture, including both liturgical and secular music."] },
        { id: "Jazz", parent: "Music", type: "Family", pop: 0.88, meta: ["A music genre that originated in the African-American communities of New Orleans, Louisiana, characterized by swing and blue notes, complex chords, and improvisation."] },
        { id: "Funk", parent: "Music", type: "Family", pop: 0.87, meta: ["A music genre that originated in African-American communities in the mid-1960s, emphasizing a strong rhythmic groove of a bass line and drum parts."] },
        { id: "Blues", parent: "Music", type: "Family", pop: 0.86, meta: ["A music genre and musical form which originated in the Deep South of the United States around the 1860s by African Americans."] },
        { id: "Folk", parent: "Music", type: "Family", pop: 0.86, meta: ["Music that originates in traditional popular culture or is written in such a style, often featuring acoustic instruments and storytelling."] },
        { id: "World Music", parent: "Music", type: "Family", pop: 0.87, meta: ["A musical category encompassing many different styles of music from around the globe, particularly non-Western traditional music."] },
        { id: "Ska", parent: "Music", type: "Family", pop: 0.86, meta: ["A music genre that originated in Jamaica in the late 1950s and was the precursor to rocksteady and reggae."] },
        { id: "Industrial", parent: "Music", type: "Family", pop: 0.85, meta: ["A genre of experimental music that draws on transgressive and provocative themes, often using harsh, electronic sounds."] },
        { id: "New Age", parent: "Music", type: "Family", pop: 0.85, meta: ["A genre of music intended to create artistic inspiration, relaxation, and optimism, used for activities like yoga and meditation."] },

        // Subgenres
        { id: "Classic Rock", parent: "Rock", type: "Subgenre", pop: 0.85, meta: ["A radio format encompassing rock music from the late 1960s to the late 1980s, particularly guitar-driven rock."] },
        { id: "Dance Pop", parent: "Pop", type: "Subgenre", pop: 0.85, meta: ["Pop music characterized by strong beats with a danceable rhythm, often influenced by disco and electronic music."] },
        { id: "K-Pop", parent: "Pop", type: "Subgenre", pop: 0.85, meta: ["A music genre originating in South Korea, characterized by a wide variety of audiovisual elements."] },
        { id: "Trap", parent: "Hip-Hop", type: "Subgenre", pop: 0.85, meta: ["A subgenre of hip hop music that originated in the Southern United States during the early 2000s, known for its aggressive sound and lyrical content."] },
        { id: "Alternative Rock", parent: "Rock", type: "Subgenre", pop: 0.84, meta: ["A genre emerging from the independent underground of the 1970s, defined by its opposition to mainstream rock."] },
        { id: "Contemporary R&B", parent: "R&B", type: "Subgenre", pop: 0.84, meta: ["A music genre that combines elements of rhythm and blues, pop, soul, funk, hip hop, and electronic music."] },
        { id: "Reggaeton", parent: "Latin", type: "Subgenre", pop: 0.84, meta: ["A music style that originated in Puerto Rico during the late 1990s, influenced by hip hop and Latin American and Caribbean music."] },
        { id: "Hard Rock", parent: "Rock", type: "Subgenre", pop: 0.82, meta: ["A highly amplified and aggressive form of rock music, characterized by distorted guitar riffs and powerful drumming."] },
        { id: "House", parent: "Electronic", type: "Subgenre", pop: 0.82, meta: ["A genre of electronic dance music characterized by a repetitive four-on-the-floor beat, originating in Chicago in the early 1980s."] },
        { id: "Country Pop", parent: "Country", type: "Subgenre", pop: 0.82, meta: ["A fusion genre of country music and pop music that developed in the 1970s."] },
        { id: "Lo-fi Hip Hop", parent: "Hip-Hop", type: "Subgenre", pop: 0.8, meta: ["A form of downtempo music that combines elements of hip hop and jazz, known for its relaxing and nostalgic quality."] },
        { id: "Heavy Metal", parent: "Metal", type: "Subgenre", pop: 0.8, meta: ["The foundational genre of metal, characterized by loud distorted guitars, emphatic rhythms, dense bass-and-drum sound, and vigorous vocals."] },
        { id: "Techno", parent: "Electronic", type: "Subgenre", pop: 0.8, meta: ["A genre of electronic dance music that emerged in Detroit, Michigan, during the mid-to-late 1980s."] },
        { id: "Film Score", parent: "Soundtrack", type: "Subgenre", pop: 0.8, meta: ["Original music written specifically to accompany a film, forming part of the film's soundtrack."] },
        { id: "Indie Rock", parent: "Rock", type: "Subgenre", pop: 0.79, meta: ["Rock music produced independently from commercial record labels, characterized by a DIY ethic."] },
        { id: "Grunge", parent: "Rock", type: "Subgenre", pop: 0.79, meta: ["A subgenre of alternative rock from the mid-1980s in the U.S. state of Washington, particularly Seattle."] },
        { id: "Teen Pop", parent: "Pop", type: "Subgenre", pop: 0.79, meta: ["Pop music that is created, marketed, and oriented toward a preteen and teenage demographic."] },
        { id: "Drill", parent: "Hip-Hop", type: "Subgenre", pop: 0.79, meta: ["A style of trap music defined by its dark, violent, and nihilistic lyrical content and ominous trap-influenced beats."] },
        { id: "Alternative R&B", parent: "R&B", type: "Subgenre", pop: 0.79, meta: ["A subgenre of R&B that emerged in the late 2000s, characterized by a more experimental, less conventional sound than its mainstream counterpart."] },
        { id: "Bachata", parent: "Latin", type: "Subgenre", pop: 0.79, meta: ["A genre of Latin American music that originated in the Dominican Republic in the first half of the 20th century."] },
        { id: "Roots Reggae", parent: "Reggae", type: "Subgenre", pop: 0.79, meta: ["A subgenre of reggae that deals with the everyday lives and aspirations of the artists concerned, often referencing Rastafarianism."] },
        { id: "Punk Rock", parent: "Rock", type: "Subgenre", pop: 0.77, meta: ["A rock music genre that developed in the mid-1970s, known for fast, hard-edged music with stripped-down instrumentation and anti-establishment lyrics."] },
        { id: "Electropop", parent: "Pop", type: "Subgenre", pop: 0.77, meta: ["A form of synth-pop with a heavy, electronic sound, which came to prominence in the 2000s."] },
        { id: "Boom Bap", parent: "Hip-Hop", type: "Subgenre", pop: 0.77, meta: ["A style of hip hop production prominent in the East Coast during the golden age of hip hop, characterized by a hard-hitting acoustic drum loop."] },
        { id: "Neo-Soul", parent: "R&B", type: "Subgenre", pop: 0.77, meta: ["A musical genre that emerged during the late 1980s and early 1990s, which fuses contemporary R&B and soul with jazz, funk, hip hop, and African music."] },
        { id: "Nu Metal", parent: "Metal", type: "Subgenre", pop: 0.77, meta: ["A subgenre of alternative metal that combines elements of heavy metal music with elements of other music genres such as hip hop, alternative rock, and funk."] },
        { id: "Salsa", parent: "Latin", type: "Subgenre", pop: 0.77, meta: ["A popular dance music genre that initially arose in New York City during the 1960s."] },
        { id: "Video Game Music", parent: "Soundtrack", type: "Subgenre", pop: 0.77, meta: ["Any music composed or adapted for video games."] },
        { id: "Bollywood", parent: "World Music", type: "Subgenre", pop: 0.77, meta: ["Filmi music, or the music from the soundtracks of the Indian film industry, known for its blend of Indian and Western influences."] },
        { id: "Classical Era", parent: "Classical", type: "Subgenre", pop: 0.77, meta: ["The period of Western art music from the 1730s to the early 1820s, between the Baroque and Romantic periods."] },
        { id: "New Wave", parent: "Rock", type: "Subgenre", pop: 0.75, meta: ["A genre that emerged in the late 1970s, moving away from blues and rock and roll roots to incorporate elements of pop, disco, and electronic music."] },
        { id: "Psychedelic Rock", parent: "Rock", type: "Subgenre", pop: 0.75, meta: ["A style of rock music inspired or influenced by psychedelic culture and attempting to replicate the mind-altering experiences of hallucinogenic drugs."] },
        { id: "Synth-pop", parent: "Pop", type: "Subgenre", pop: 0.75, meta: ["A subgenre of new wave music that became prominent in the late 1970s and is characterized by the synthesizer as the dominant musical instrument."] },
        { id: "Mumble Rap", parent: "Hip-Hop", type: "Subgenre", pop: 0.75, meta: ["A loosely defined microgenre of hip hop that largely emerged in the mid-2010s, characterized by slurred or unclear vocal delivery."] },
        { id: "Gangsta Rap", parent: "Hip-Hop", type: "Subgenre", pop: 0.75, meta: ["A subgenre of hip hop that reflects the violent lifestyles of inner-city American youths."] },
        { id: "Dubstep", parent: "Electronic", type: "Subgenre", pop: 0.75, meta: ["A genre of electronic dance music that originated in South London, England, characterized by sparse, syncopated drum patterns with prominent sub-bass frequencies."] },
        { id: "Trance", parent: "Electronic", type: "Subgenre", pop: 0.75, meta: ["A genre of electronic dance music that developed during the 1990s in Germany, characterized by a tempo between 125 and 150 bpm and repeating melodic phrases."] },
        { id: "Motown", parent: "R&B", type: "Subgenre", pop: 0.75, meta: ["A style of rhythm and blues music named after the Motown record label, which had a significant impact on popular music in the 1960s."] },
        { id: "Thrash Metal", parent: "Metal", type: "Subgenre", pop: 0.75, meta: ["An extreme subgenre of heavy metal music characterized by its overall aggression and often fast tempo."] },
        { id: "Romantic Classical", parent: "Classical", type: "Subgenre", pop: 0.75, meta: ["A stylistic movement in Western classical music associated with the 19th century, characterized by an emphasis on emotion and individualism."] },
        { id: "Baroque", parent: "Classical", type: "Subgenre", pop: 0.75, meta: ["A style of Western art music composed from approximately 1600 to 1750, known for its grandeur, drama, and complexity."] },
        { id: "Dancehall", parent: "Reggae", type: "Subgenre", pop: 0.75, meta: ["A genre of Jamaican popular music that originated in the late 1970s, featuring a DJ singing and toasting over recorded rhythms."] },
        { id: "Funk Soul", parent: "Funk", type: "Subgenre", pop: 0.75, meta: ["A fusion of funk and soul music, emphasizing strong grooves, powerful vocals, and horn sections."] },
        { id: "Post-Punk", parent: "Rock", type: "Subgenre", pop: 0.74, meta: ["A diverse rock genre that emerged from the punk movement of the 1970s, incorporating more experimental and atmospheric elements."] },
        { id: "Indie Pop", parent: "Pop", type: "Subgenre", pop: 0.74, meta: ["A genre of alternative rock that originated in the United Kingdom in the late 1970s, characterized by a focus on catchy, melodic pop songs."] },
        { id: "Conscious Hip-Hop", parent: "Hip-Hop", type: "Subgenre", pop: 0.74, meta: ["A subgenre of hip hop that challenges the dominant cultural, political, philosophical, and economic consensus."] },
        { id: "Drum and Bass", parent: "Electronic", type: "Subgenre", pop: 0.74, meta: ["A genre of electronic music characterized by fast breakbeats with heavy bass and sub-bass lines, which emerged in England in the 1990s."] },
        { id: "Metalcore", parent: "Metal", type: "Subgenre", pop: 0.74, meta: ["A fusion genre that combines elements of extreme metal and hardcore punk."] },
        { id: "Cumbia", parent: "Latin", type: "Subgenre", pop: 0.74, meta: ["A music genre and dance that originated in Colombia's Caribbean coastal region and Panama."] },
        { id: "Indie Folk", parent: "Folk", type: "Subgenre", pop: 0.74, meta: ["A music genre that arose in the 1990s from artists in the indie rock community influenced by folk and classic country music."] },
        { id: "Electric Blues", parent: "Blues", type: "Subgenre", pop: 0.74, meta: ["A type of blues music distinguished by the use of electric amplification for musical instruments."] },
        { id: "Progressive Rock", parent: "Rock", type: "Subgenre", pop: 0.72, meta: ["A rock subgenre characterized by complex compositions, conceptual lyrics, and instrumental virtuosity."] },
        { id: "Britpop", parent: "Rock", type: "Subgenre", pop: 0.72, meta: ["A UK-based music and culture movement in the mid-1990s that emphasized Britishness, with catchy, guitar-based pop songs."] },
        { id: "J-Pop", parent: "Pop", type: "Subgenre", pop: 0.72, meta: ["A musical genre originating in Japan, referring to mainstream popular music."] },
        { id: "Old School Hip-Hop", parent: "Hip-Hop", type: "Subgenre", pop: 0.72, meta: ["A style of hip hop production prominent in the East Coast during the golden age of hip hop, characterized by a hard-hitting acoustic drum loop."] },
        { id: "Ambient", parent: "Electronic", type: "Subgenre", pop: 0.72, meta: ["A genre of music that emphasizes tone and atmosphere over traditional musical structure or rhythm."] },
        { id: "Outlaw Country", parent: "Country", type: "Subgenre", pop: 0.72, meta: ["A subgenre of American country music, most popular during the late 1960s and 1970s, which opposed the slick production of Nashville sound."] },
        { id: "Swing", parent: "Jazz", type: "Subgenre", pop: 0.72, meta: ["A form of jazz that developed in the United States in the early 1930s and became a dominant style in popular music during the 'Swing Era'."] },
        { id: "Folk Rock", parent: "Folk", type: "Subgenre", pop: 0.72, meta: ["A musical genre combining elements of folk music and rock music, which arose in the mid-1960s."] },
        { id: "Ska Punk", parent: "Ska", type: "Subgenre", pop: 0.72, meta: ["A fusion music genre that combines ska and punk rock."] },
        { id: "Garage Rock", parent: "Rock", type: "Subgenre", pop: 0.71, meta: ["A raw and energetic style of rock and roll that flourished in the mid-1960s, often produced by amateur musicians in garages."] },
        { id: "Grime", parent: "Hip-Hop", type: "Subgenre", pop: 0.71, meta: ["A genre of electronic music that emerged in London in the early 2000s, developed out of UK garage and jungle."] },
        { id: "Progressive Metal", parent: "Metal", type: "Subgenre", pop: 0.71, meta: ["A fusion genre that combines heavy metal and progressive rock, mixing the loud aggression of the former with the experimental and complex composition of the latter."] },
        { id: "Bluegrass", parent: "Country", type: "Subgenre", pop: 0.71, meta: ["A genre of American roots music that developed in the 1940s in the Appalachian region of the United States."] },
        { id: "Chicago Blues", parent: "Blues", type: "Subgenre", pop: 0.71, meta: ["A form of blues music indigenous to Chicago, Illinois, which developed from classic blues as a result of the Great Migration."] },
        { id: "Industrial Rock", parent: "Industrial", type: "Subgenre", pop: 0.71, meta: ["A fusion genre that merges industrial music and rock music."] },
        { id: "P-Funk", parent: "Funk", type: "Subgenre", pop: 0.71, meta: ["A style of funk music heavily influenced by the bands Parliament and Funkadelic, characterized by psychedelic and sci-fi themes."] },
        { id: "Southern Rock", parent: "Rock", type: "Subgenre", pop: 0.7, meta: ["A subgenre of rock music that developed in the Southern United States, incorporating elements of rock and roll, country music, and blues."] },
        { id: "Dream Pop", parent: "Pop", type: "Subgenre", pop: 0.7, meta: ["A subgenre of alternative rock and neo-psychedelia that emphasizes atmospheric textures and melodies."] },
        { id: "Death Metal", parent: "Metal", type: "Subgenre", pop: 0.7, meta: ["An extreme subgenre of heavy metal music that typically employs heavily distorted guitars, deep growling vocals, and blast beat drumming."] },
        { id: "Bossa Nova", parent: "Latin", type: "Subgenre", pop: 0.7, meta: ["A style of samba developed in the late 1950s and early 1960s in Rio de Janeiro, Brazil."] },
        { id: "Americana", parent: "Country", type: "Subgenre", pop: 0.7, meta: ["A blend of American roots music styles, including country, folk, blues, and rock and roll."] },
        { id: "Contemporary Classical", parent: "Classical", type: "Subgenre", pop: 0.7, meta: ["Music written in the present day, covering a wide range of styles from the mid-20th century to the present."] },
        { id: "Bebop", parent: "Jazz", type: "Subgenre", pop: 0.7, meta: ["A style of jazz developed in the early to mid-1940s, characterized by fast tempos, complex chord progressions, and instrumental virtuosity."] },
        { id: "Cool Jazz", parent: "Jazz", type: "Subgenre", pop: 0.7, meta: ["A style of modern jazz music that arose in the United States after World War II, characterized by relaxed tempos and lighter tone."] },
        { id: "Dub", parent: "Reggae", type: "Subgenre", pop: 0.7, meta: ["A genre of electronic music that grew out of reggae in the 1960s, and is commonly considered a subgenre, though it has developed to extend beyond the scope of reggae."] },
        { id: "Contemporary Folk", parent: "Folk", type: "Subgenre", pop: 0.7, meta: ["A broad term for folk music that has been written and recorded in modern times."] },
        { id: "Afrobeat", parent: "World Music", type: "Subgenre", pop: 0.7, meta: ["A music genre which involves the combination of elements of West African musical styles such as fuji music and highlife with American funk and jazz influences."] },
        { id: "Celtic", parent: "World Music", type: "Subgenre", pop: 0.7, meta: ["A broad grouping of music genres that evolved out of the folk music traditions of the Celtic people of Western Europe."] },
        { id: "Funk Rock", parent: "Rock", type: "Subgenre", pop: 0.75, meta: ["A fusion genre that mixes elements of funk and rock."] },
        { id: "Honky Tonk", parent: "Country", type: "Subgenre", pop: 0.71, meta: ["A style of country music often played in bars, with lyrics focused on working-class life."] },
        { id: "Surf Rock", parent: "Rock", type: "Subgenre", pop: 0.7, meta: ["A subgenre of rock music associated with surf culture, known for its reverberated electric guitar."] },
        { id: "Big Band", parent: "Jazz", type: "Subgenre", pop: 0.71, meta: ["A type of musical ensemble of jazz music that usually consists of ten or more musicians with four sections."] },
        { id: "2 Tone", parent: "Ska", type: "Subgenre", pop: 0.7, meta: ["A genre of British popular music that fused traditional Jamaican ska with punk rock and new wave."] },
        { id: "IDM", parent: "Electronic", type: "Subgenre", pop: 0.7, meta: ["Intelligent Dance Music, a style of electronic music intended more for home listening than for dancing."] },
        { id: "Minimalism", parent: "Classical", type: "Subgenre", pop: 0.7, meta: ["A form of art music that employs limited or minimal musical materials, often featuring repetition and stasis."] },
        { id: "Chillwave", parent: "Electronic", type: "Subgenre", pop: 0.7, meta: ["A music microgenre characterized by a faded or dreamy sound and a nostalgic, lo-fi aesthetic."] },
        { id: "Vaporwave", parent: "Electronic", type: "Subgenre", pop: 0.7, meta: ["A microgenre of electronic music characterized by a nostalgic engagement with 1980s and 1990s pop culture."] },

        // Styles
        { id: "Arena Style", parent: "Hard Rock", type: "Style", pop: 0.7, meta: ["A commercially-oriented style of rock music designed for large audiences, with anthemic choruses and prominent guitar solos."] },
        { id: "Grunge Style", parent: "Alternative Rock", type: "Style", pop: 0.7, meta: ["A style of alternative rock characterized by heavily distorted guitars, angst-filled lyrics, and a sludgy, unpolished sound."] },
        { id: "Hard Style", parent: "Hard Rock", type: "Style", pop: 0.63, meta: ["A style defined by aggressive vocals, distorted electric guitars, bass guitar, and drums, often with a driving rhythm."] },
        { id: "Alt Style", parent: "Alternative Rock", type: "Style", pop: 0.6, meta: ["A general term for styles outside of the musical mainstream, often characterized by experimentation and a DIY ethic."] },
        { id: "Synth Style", parent: "Synth-pop", type: "Style", pop: 0.58, meta: ["A style defined by the prominent use of synthesizers, drum machines, and sequencers, often with a clean, melodic sound."] },
        { id: "Teen Synth Style", parent: "Teen Pop", type: "Style", pop: 0.55, meta: ["An upbeat, synthesizer-heavy style of pop music targeted at a youth audience."] },
        { id: "Shoegaze", parent: "Alternative Rock", type: "Style", pop: 0.59, meta: ["A style of alternative rock known for its ethereal mixture of obscured vocals, guitar distortion, and effects."] },
        // Artists
        { id: "Michael Jackson", parent: "Pop", type: "Artist", pop: 0.55, meta: ["An American singer, songwriter, and dancer, dubbed the 'King of Pop', one of the most significant cultural figures of the 20th century."] },
        { id: "The Beatles", parent: "Classic Rock", type: "Artist", pop: 0.55, meta: ["An English rock band formed in Liverpool in 1960, widely regarded as the most influential band of all time."] },
        { id: "Drake", parent: "Hip-Hop", type: "Artist", pop: 0.55, meta: ["A Canadian rapper, singer, and actor, an influential figure in contemporary popular music, credited for popularizing the Toronto sound."] },
        { id: "Rihanna", parent: "Pop", type: "Artist", pop: 0.55, meta: ["A Barbadian singer, actress, and businesswoman, known for embracing various musical styles and reinventing her image throughout her career."] },
        { id: "BTS", parent: "K-Pop", type: "Artist", pop: 0.55, meta: ["A South Korean boy band that formed in 2010, one of the best-selling artists in South Korean history and a global phenomenon."] },
        { id: "Beyonce", parent: "Contemporary R&B", type: "Artist", pop: 0.55, meta: ["An American singer, songwriter, and actress, a globally recognized cultural icon known for her powerful vocals and stage presence."] },
        { id: "Bad Bunny", parent: "Reggaeton", type: "Artist", pop: 0.54, meta: ["A Puerto Rican rapper and singer, whose music is often defined as Latin trap and reggaeton."] },
        { id: "Madonna", parent: "Pop", type: "Artist", pop: 0.54, meta: ["An American singer, songwriter, and actress, referred to as the 'Queen of Pop', known for pushing the boundaries of artistic expression in mainstream music."] },
        { id: "Ariana Grande", parent: "Pop", type: "Artist", pop: 0.54, meta: ["An American singer and actress, known for her four-octave vocal range and pop and R&B music."] },
        { id: "Kendrick Lamar", parent: "Conscious Hip-Hop", type: "Artist", pop: 0.54, meta: ["An American rapper, songwriter, and record producer, regarded as one of the most influential artists of his generation."] },
        { id: "Queen", parent: "Classic Rock", type: "Artist", pop: 0.54, meta: ["A British rock band formed in London in 1970, known for their musical versatility and theatrical live performances."] },
        { id: "Harry Styles", parent: "Pop", type: "Artist", pop: 0.54, meta: ["An English singer, songwriter, and actor, who rose to fame as a member of the boy band One Direction."] },
        { id: "Kanye West", parent: "Hip-Hop", type: "Artist", pop: 0.54, meta: ["An American rapper, record producer, and fashion designer, one of the most critically acclaimed musicians of his generation."] },
        { id: "Eminem", parent: "Hip-Hop", type: "Artist", pop: 0.54, meta: ["An American rapper, songwriter, and record producer, credited with popularizing hip hop in Middle America."] },
        { id: "Blackpink", parent: "K-Pop", type: "Artist", pop: 0.54, meta: ["A South Korean girl group formed by YG Entertainment, the most successful Korean girl group internationally."] },
        { id: "The Rolling Stones", parent: "Classic Rock", type: "Artist", pop: 0.53, meta: ["An English rock band formed in London in 1962, part of the British Invasion and known for their blues-infused rock and roll."] },
        { id: "Whitney Houston", parent: "Pop", type: "Artist", pop: 0.53, meta: ["An American singer and actress, one of the best-selling music artists of all time, known for her powerful vocals."] },
        { id: "Ed Sheeran", parent: "Pop", type: "Artist", pop: 0.53, meta: ["An English singer-songwriter, one of the world's best-selling music artists."] },
        { id: "Jay-Z", parent: "Hip-Hop", type: "Artist", pop: 0.53, meta: ["An American rapper, songwriter, record executive, and businessman, one of the most influential hip-hop artists in history."] },
        { id: "The Weeknd", parent: "Alternative R&B", type: "Artist", pop: 0.53, meta: ["A Canadian singer, songwriter, and record producer, known for his dark-themed R&B and sonic versatility."] },
        { id: "Led Zeppelin", parent: "Hard Rock", type: "Artist", pop: 0.53, meta: ["An English rock band formed in London in 1968, considered one of the pioneers of hard rock and heavy metal."] },
        { id: "Adele", parent: "Pop", type: "Artist", pop: 0.53, meta: ["An English singer and songwriter, known for her powerful mezzo-soprano vocals and songwriting."] },
        { id: "Bob Marley", parent: "Roots Reggae", type: "Artist", pop: 0.53, meta: ["A Jamaican singer, songwriter, and musician, considered one of the pioneers of reggae."] },
        { id: "David Bowie", parent: "Rock", type: "Artist", pop: 0.53, meta: ["An English singer-songwriter and actor, a leading figure in the music industry and is considered one of the most influential musicians of the 20th century."] },
        { id: "Prince", parent: "Pop", type: "Artist", pop: 0.53, meta: ["An American singer-songwriter, multi-instrumentalist, and record producer, known for his eclectic work and flamboyant stage presence."] },
        { id: "Tupac Shakur", parent: "Gangsta Rap", type: "Artist", pop: 0.53, meta: ["An American rapper and actor, considered by many to be one of the most influential rappers of all time."] },
        { id: "The Notorious B.I.G.", parent: "Boom Bap", type: "Artist", pop: 0.53, meta: ["An American rapper, widely considered to be one of the greatest rappers of all time."] },
        { id: "Stevie Wonder", parent: "Motown", type: "Artist", pop: 0.53, meta: ["An American singer, songwriter, musician, and record producer, a prominent figure in popular music during the latter half of the 20th century."] },
        { id: "Shakira", parent: "Latin", type: "Artist", pop: 0.53, meta: ["A Colombian singer and songwriter, referred to as the 'Queen of Latin Music'."] },
        { id: "Lady Gaga", parent: "Dance Pop", type: "Artist", pop: 0.52, meta: ["An American singer, songwriter, and actress, known for her image reinventions and musical versatility."] },
        { id: "Travis Scott", parent: "Trap", type: "Artist", pop: 0.52, meta: ["An American rapper, singer, songwriter, and record producer, known for his heavily auto-tuned, atmospheric sound."] },
        { id: "Pink Floyd", parent: "Progressive Rock", type: "Artist", pop: 0.52, meta: ["An English rock band formed in London in 1965, distinguished by their philosophical lyrics, sonic experimentation, and elaborate live shows."] },
        { id: "Mariah Carey", parent: "Pop", type: "Artist", pop: 0.52, meta: ["An American singer, songwriter, actress, and record producer, referred to as the 'Songbird Supreme' for her five-octave vocal range."] },
        { id: "Dua Lipa", parent: "Dance Pop", type: "Artist", pop: 0.52, meta: ["An English-Albanian singer and songwriter, known for her disco-influenced sound."] },
        { id: "J. Cole", parent: "Conscious Hip-Hop", type: "Artist", pop: 0.52, meta: ["An American rapper, singer, songwriter, and record producer, regarded as one of the most influential rappers of his generation."] },
        { id: "Aretha Franklin", parent: "R&B", type: "Artist", pop: 0.52, meta: ["An American singer, songwriter, and pianist, referred to as the 'Queen of Soul', a major figure in American music history."] },
        { id: "Metallica", parent: "Thrash Metal", type: "Artist", pop: 0.52, meta: ["An American heavy metal band, one of the founding 'big four' of thrash metal."] },
        { id: "Nirvana", parent: "Grunge", type: "Artist", pop: 0.52, meta: ["An American rock band formed in Aberdeen, Washington, in 1987, credited with bringing alternative rock to the mainstream."] },
        { id: "John Williams", parent: "Film Score", type: "Artist", pop: 0.52, meta: ["An American composer, conductor, and pianist, widely regarded as one of the greatest film composers of all time."] },
        { id: "Billie Eilish", parent: "Electropop", type: "Artist", pop: 0.51, meta: ["An American singer-songwriter, known for her genre-defying music that combines elements of pop, alternative, and electronic music."] },
        { id: "Post Malone", parent: "Hip-Hop", type: "Artist", pop: 0.51, meta: ["An American rapper, singer, and songwriter, known for his blending of genres including hip hop, pop, R&B, and rock."] },
        { id: "Fleetwood Mac", parent: "Rock", type: "Artist", pop: 0.51, meta: ["A British-American rock band, formed in London in 1967, known for their commercially successful and tumultuous career."] },
        { id: "U2", parent: "Alternative Rock", type: "Artist", pop: 0.51, meta: ["An Irish rock band from Dublin, formed in 1976, whose sound evolved from post-punk to embrace many genres."] },
        { id: "Britney Spears", parent: "Teen Pop", type: "Artist", pop: 0.51, meta: ["An American singer, dancer, and actress, referred to as the 'Princess of Pop', credited with influencing the revival of teen pop during the late 1990s."] },
        { id: "Nicki Minaj", parent: "Hip-Hop", type: "Artist", pop: 0.51, meta: ["A Trinidadian-born rapper, singer, and songwriter, known for her animated flow and use of alter egos."] },
        { id: "SZA", parent: "Contemporary R&B", type: "Artist", pop: 0.51, meta: ["An American singer and songwriter, known for her genre-bending music which incorporates elements of soul, hip hop, and alternative R&B."] },
        { id: "Black Sabbath", parent: "Heavy Metal", type: "Artist", pop: 0.51, meta: ["An English rock band formed in Birmingham in 1968, often cited as pioneers of heavy metal music."] },
        { id: "Linkin Park", parent: "Nu Metal", type: "Artist", pop: 0.51, meta: ["An American rock band from Agoura Hills, California, who rose to fame with their debut album 'Hybrid Theory'."] },
        { id: "Daddy Yankee", parent: "Reggaeton", type: "Artist", pop: 0.51, meta: ["A Puerto Rican rapper, singer, and songwriter, who coined the word reggaeton in 1994 to describe the new music genre."] },
        { id: "Johnny Cash", parent: "Country", type: "Artist", pop: 0.51, meta: ["An American singer-songwriter, whose genre-spanning songs and sound embraced country, rock and roll, blues, and folk."] },
        { id: "Bob Dylan", parent: "Folk Rock", type: "Artist", pop: 0.51, meta: ["An American singer-songwriter, author and visual artist, widely regarded as one of the greatest songwriters of all time."] },
        { id: "Hans Zimmer", parent: "Film Score", type: "Artist", pop: 0.51, meta: ["A German film score composer and record producer, known for integrating electronic music sounds with traditional orchestral arrangements."] },
        { id: "Guns N' Roses", parent: "Hard Rock", type: "Artist", pop: 0.51, meta: ["An American hard rock band from Los Angeles, California, formed in 1985."] },
        { id: "Cardi B", parent: "Trap", type: "Artist", pop: 0.51, meta: ["An American rapper and songwriter, known for her aggressive flow and candid lyrics."] },
        { id: "Marvin Gaye", parent: "Motown", type: "Artist", pop: 0.51, meta: ["An American singer and songwriter who helped to shape the sound of Motown in the 1960s."] },
        { id: "Dolly Parton", parent: "Country", type: "Artist", pop: 0.51, meta: ["An American singer, songwriter, multi-instrumentalist, actress, and businesswoman, one of the most honored female country performers of all time."] },
        { id: "Bruce Springsteen", parent: "Rock", type: "Artist", pop: 0.5, meta: ["An American singer, songwriter, and musician known for his poetic, socially conscious lyrics and energetic stage performances."] },
        { id: "Red Hot Chili Peppers", parent: "Funk Rock", type: "Artist", pop: 0.5, meta: ["An American rock band formed in Los Angeles in 1983, whose music incorporates elements of alternative rock, funk, and punk rock."] },
        { id: "Juice WRLD", parent: "Trap", type: "Artist", pop: 0.5, meta: ["An American rapper, singer, and songwriter, a leading figure in the emo rap and SoundCloud rap genres."] },
        { id: "Janet Jackson", parent: "Contemporary R&B", type: "Artist", pop: 0.5, meta: ["An American singer, songwriter, dancer, and actress, known for her innovative and socially conscious records."] },
        { id: "Radiohead", parent: "Alternative Rock", type: "Artist", pop: 0.5, meta: ["An English rock band formed in Abingdon, Oxfordshire, in 1985, known for their experimental approach to alternative rock."] },
        { id: "Justin Timberlake", parent: "Pop", type: "Artist", pop: 0.5, meta: ["An American singer, songwriter, actor, and record producer who rose to prominence as a member of the boy band NSYNC."] },
        { id: "OutKast", parent: "Hip-Hop", type: "Artist", pop: 0.5, meta: ["An American hip hop duo formed in 1992 in East Point, Georgia, consisting of André '3000' Benjamin and Antwan 'Big Boi' Patton."] },
        { id: "Daft Punk", parent: "House", type: "Artist", pop: 0.5, meta: ["A French electronic music duo formed in 1993 in Paris, who achieved significant popularity in the late 1990s as part of the French house movement."] },
        { id: "Frank Ocean", parent: "Alternative R&B", type: "Artist", pop: 0.5, meta: ["An American singer, songwriter, and rapper, credited with pioneering the alternative R&B genre."] },
        { id: "Alicia Keys", parent: "Contemporary R&B", type: "Artist", pop: 0.5, meta: ["An American singer, songwriter, and musician, known for her blend of classical piano with R&B, soul, and jazz."] },
        { id: "Iron Maiden", parent: "Heavy Metal", type: "Artist", pop: 0.5, meta: ["An English heavy metal band formed in Leyton, East London, in 1975, pioneers of the new wave of British heavy metal."] },
        { id: "TWICE", parent: "K-Pop", type: "Artist", pop: 0.5, meta: ["A South Korean girl group formed by JYP Entertainment, known for their catchy songs and energetic performances."] },
        { id: "Migos", parent: "Trap", type: "Artist", pop: 0.5, meta: ["An American hip hop trio from Lawrenceville, Georgia, founded in 2008, known for popularizing the 'Migos flow'."] },
        { id: "James Brown", parent: "Funk Soul", type: "Artist", pop: 0.5, meta: ["An American singer, songwriter, and dancer, referred to as the 'Godfather of Soul'."] },
        { id: "Foo Fighters", parent: "Alternative Rock", type: "Artist", pop: 0.5, meta: ["An American rock band formed in Seattle, Washington, in 1994 by Nirvana drummer Dave Grohl."] },
        { id: "Future", parent: "Trap", type: "Artist", pop: 0.5, meta: ["An American rapper and singer, known for his mumble-styled vocals and prolific output."] },
        { id: "Usher", parent: "Contemporary R&B", type: "Artist", pop: 0.5, meta: ["An American singer, songwriter, and dancer, one of the best-selling music artists of the 2000s decade."] },
        { id: "System of a Down", parent: "Nu Metal", type: "Artist", pop: 0.5, meta: ["An Armenian-American heavy metal band from Glendale, California, formed in 1994."] },
        { id: "Arctic Monkeys", parent: "Indie Rock", type: "Artist", pop: 0.49, meta: ["An English rock band formed in Sheffield in 2002, who rose to fame via the Internet."] },
        { id: "Wu-Tang Clan", parent: "Boom Bap", type: "Artist", pop: 0.49, meta: ["An American hip hop collective from Staten Island, New York City, originally composed of East Coast rappers."] },
        { id: "Calvin Harris", parent: "House", type: "Artist", pop: 0.49, meta: ["A Scottish DJ, record producer, singer, and songwriter, known for his successful collaborations with numerous pop artists."] },
        { id: "Slipknot", parent: "Nu Metal", type: "Artist", pop: 0.49, meta: ["An American heavy metal band from Des Moines, Iowa, known for its attention-grabbing image, aggressive style of music, and energetic live shows."] },
        { id: "Tom Petty", parent: "Rock", type: "Artist", pop: 0.48, meta: ["An American singer, songwriter, musician, record producer, and actor, best known as the lead vocalist of Tom Petty and the Heartbreakers."] },
        { id: "The Police", parent: "New Wave", type: "Artist", pop: 0.48, meta: ["An English rock band formed in London in 1977, known for their rock sound influenced by punk, reggae, and jazz."] },
        { id: "Lana Del Rey", parent: "Indie Pop", type: "Artist", pop: 0.48, meta: ["An American singer-songwriter, known for her cinematic quality and exploration of themes of tragic romance and melancholia."] },
        { id: "Missy Elliott", parent: "Hip-Hop", type: "Artist", pop: 0.48, meta: ["An American rapper, singer, songwriter, and record producer, known for her series of hits and innovative music videos."] },
        { id: "Avicii", parent: "House", type: "Artist", pop: 0.48, meta: ["A Swedish DJ, remixer, and music producer, who rose to prominence in 2011 with his single 'Levels'."] },
        { id: "Ricky Martin", parent: "Latin", type: "Artist", pop: 0.48, meta: ["A Puerto Rican singer, songwriter, and actor, known as the 'King of Latin Pop'."] },
        { id: "Shania Twain", parent: "Country Pop", type: "Artist", pop: 0.48, meta: ["A Canadian singer and songwriter, one of the best-selling female artists in country music history."] },
        { id: "Mozart", parent: "Classical Era", type: "Artist", pop: 0.48, meta: ["Wolfgang Amadeus Mozart, a prolific and influential composer of the Classical period."] },
        { id: "Beethoven", parent: "Classical Era", type: "Artist", pop: 0.48, meta: ["Ludwig van Beethoven, a German composer and pianist, a crucial figure in the transition between the Classical and Romantic eras."] },
        { id: "Louis Armstrong", parent: "Jazz", type: "Artist", pop: 0.48, meta: ["An American trumpeter and vocalist, one of the most influential figures in jazz."] },
        { id: "Simon & Garfunkel", parent: "Folk Rock", type: "Artist", pop: 0.48, meta: ["An American folk-rock duo consisting of singer-songwriter Paul Simon and singer Art Garfunkel."] },
        { id: "The Killers", parent: "Indie Rock", type: "Artist", pop: 0.48, meta: ["An American rock band formed in Las Vegas in 2001, known for their post-punk revival sound."] },
        { id: "Oasis", parent: "Britpop", type: "Artist", pop: 0.48, meta: ["An English rock band formed in Manchester in 1991, one of the most successful acts of the Britpop movement."] },
        { id: "A Tribe Called Quest", parent: "Boom Bap", type: "Artist", pop: 0.48, meta: ["An American hip hop group formed in St. Albans, Queens, New York, in 1985, pioneers of alternative hip hop."] },
        { id: "Pantera", parent: "Metal", type: "Artist", pop: 0.48, meta: ["An American heavy metal band from Arlington, Texas, formed in 1981, known for developing the groove metal subgenre."] },
        { id: "Garth Brooks", parent: "Country Pop", type: "Artist", pop: 0.48, meta: ["An American country music singer and songwriter, known for integrating rock and pop elements into the country genre."] },
        { id: "Bach", parent: "Baroque", type: "Artist", pop: 0.48, meta: ["Johann Sebastian Bach, a German composer and musician of the Baroque period."] },
        { id: "John Coltrane", parent: "Jazz", type: "Artist", pop: 0.48, meta: ["An American jazz saxophonist and composer, a pivotal figure in the development of bebop and free jazz."] },
        { id: "Stevie Ray Vaughan", parent: "Electric Blues", type: "Artist", pop: 0.48, meta: ["An American musician, singer, songwriter, and record producer, and one of the most influential electric guitarists in the history of blues music."] },
        { id: "The Clash", parent: "Punk Rock", type: "Artist", pop: 0.47, meta: ["An English rock band formed in London in 1976, a critical component of the original wave of British punk rock."] },
        { id: "Lorde", parent: "Indie Pop", type: "Artist", pop: 0.47, meta: ["A New Zealand singer-songwriter, known for her unconventional musical styles and introspective songwriting."] },
        { id: "Pop Smoke", parent: "Drill", type: "Artist", pop: 0.47, meta: ["An American rapper, considered by many to be the face of Brooklyn drill."] },
        { id: "Skrillex", parent: "Dubstep", type: "Artist", pop: 0.47, meta: ["An American DJ, record producer, and singer, who rose to fame in the early 2010s for popularizing dubstep in the United States."] },
        { id: "Judas Priest", parent: "Heavy Metal", type: "Artist", pop: 0.47, meta: ["An English heavy metal band formed in Birmingham in 1969, known for their twin lead guitars and operatic vocal style."] },
        { id: "Gloria Estefan", parent: "Latin", type: "Artist", pop: 0.47, meta: ["A Cuban-American singer, songwriter, actress and businesswoman, known as the 'Queen of Latin Pop'."] },
        { id: "Willie Nelson", parent: "Outlaw Country", type: "Artist", pop: 0.47, meta: ["An American musician, actor, and activist, a main figure of the outlaw country subgenre."] },
        { id: "Miles Davis", parent: "Cool Jazz", type: "Artist", pop: 0.47, meta: ["An American trumpeter, bandleader, and composer, among the most influential and acclaimed figures in the history of jazz."] },
        { id: "Sean Paul", parent: "Dancehall", type: "Artist", pop: 0.47, meta: ["A Jamaican rapper and singer who is regarded as one of the genre's most prolific artists."] },
        { id: "B.B. King", parent: "Electric Blues", type: "Artist", pop: 0.47, meta: ["An American blues singer-songwriter, guitarist, and record producer, who introduced a sophisticated style of soloing based on fluid string bending and shimmering vibrato."] },
        { id: "Deftones", parent: "Alternative Rock", type: "Artist", pop: 0.47, meta: ["An American rock band from Sacramento, California, formed in 1988."] },
        { id: "No Doubt", parent: "Ska Punk", type: "Artist", pop: 0.47, meta: ["An American rock band from Anaheim, California, formed in 1986, known for their fusion of ska punk and alternative rock."] },
        { id: "Rammstein", parent: "Industrial", type: "Artist", pop: 0.47, meta: ["A German Neue Deutsche Härte band formed in Berlin in 1994."] },
        { id: "A. R. Rahman", parent: "Bollywood", type: "Artist", pop: 0.47, meta: ["An Indian film composer, record producer, singer, and songwriter, known for integrating Indian classical music with electronic music and world music genres."] },
        { id: "Tame Impala", parent: "Psychedelic Rock", type: "Artist", pop: 0.46, meta: ["The psychedelic music project of Australian multi-instrumentalist Kevin Parker."] },
        { id: "Depeche Mode", parent: "Synth-pop", type: "Artist", pop: 0.46, meta: ["An English electronic music band formed in Basildon in 1980, one of the most successful electronic bands in music history."] },
        { id: "Erykah Badu", parent: "Neo-Soul", type: "Artist", pop: 0.46, meta: ["An American singer-songwriter, record producer and actress, whose work incorporates elements of R&B, soul, and hip hop."] },
        { id: "Megadeth", parent: "Thrash Metal", type: "Artist", pop: 0.46, meta: ["An American heavy metal band formed in Los Angeles in 1983, one of the founding 'big four' of thrash metal."] },
        { id: "George Strait", parent: "Country", type: "Artist", pop: 0.46, meta: ["An American country music singer, songwriter, actor, and music producer, known as the 'King of Country'."] },
        { id: "The Strokes", parent: "Garage Rock", type: "Artist", pop: 0.45, meta: ["An American rock band from New York City, formed in 1998, credited with reviving garage rock in the early 2000s."] },
        { id: "The Cure", parent: "Post-Punk", type: "Artist", pop: 0.45, meta: ["An English rock band formed in Crawley in 1978, a key figure in the development of gothic rock."] },
        { id: "Run-DMC", parent: "Old School Hip-Hop", type: "Artist", pop: 0.45, meta: ["An American hip hop group from Hollis, Queens, New York, founded in 1983, one of the most influential acts in the history of hip hop culture."] },
        { id: "Kraftwerk", parent: "Electronic", type: "Artist", pop: 0.45, meta: ["A German band formed in Düsseldorf in 1970, widely considered innovators and pioneers of electronic music."] },
        { id: "Deadmau5", parent: "Electronic", type: "Artist", pop: 0.45, meta: ["A Canadian electronic music producer, DJ, and musician, known for his progressive house music."] },
        { id: "The Prodigy", parent: "Electronic", type: "Artist", pop: 0.45, meta: ["An English electronic dance music band from Braintree, Essex, formed in 1990, pioneers of the big beat genre."] },
        { id: "D'Angelo", parent: "Neo-Soul", type: "Artist", pop: 0.45, meta: ["An American singer, songwriter, multi-instrumentalist and record producer, a leading figure in the neo-soul movement."] },
        { id: "Slayer", parent: "Thrash Metal", type: "Artist", pop: 0.45, meta: ["An American thrash metal band from Huntington Park, California, one of the founding 'big four' of thrash metal."] },
        { id: "Bring Me The Horizon", parent: "Metalcore", type: "Artist", pop: 0.45, meta: ["A British rock band formed in Sheffield in 2004, known for their stylistic shifts and experimental approach to metalcore."] },
        { id: "Celia Cruz", parent: "Salsa", type: "Artist", pop: 0.45, meta: ["A Cuban singer and one of the most popular Latin artists of the 20th century, known as the 'Queen of Salsa'."] },
        { id: "Hank Williams", parent: "Honky Tonk", type: "Artist", pop: 0.45, meta: ["An American singer-songwriter, regarded as one of the most significant and influential American singers and songwriters of the 20th century."] },
        { id: "Tchaikovsky", parent: "Romantic Classical", type: "Artist", pop: 0.45, meta: ["Pyotr Ilyich Tchaikovsky, a Russian composer of the Romantic period."] },
        { id: "Chopin", parent: "Romantic Classical", type: "Artist", pop: 0.45, meta: ["Frédéric Chopin, a Polish composer and virtuoso pianist of the Romantic period."] },
        { id: "Sly & The Family Stone", parent: "Funk Soul", type: "Artist", pop: 0.45, meta: ["An American band from San Francisco, pivotal in the development of funk, soul, rock, and psychedelic music."] },
        { id: "Joni Mitchell", parent: "Folk", type: "Artist", pop: 0.45, meta: ["A Canadian singer-songwriter, known for her poetic lyrics and distinctive soprano voice."] },
        { id: "Muddy Waters", parent: "Chicago Blues", type: "Artist", pop: 0.45, meta: ["An American blues singer-songwriter and musician who was an important figure in the post-war blues scene, and is often cited as the 'father of modern Chicago blues'."] },
        { id: "The Beach Boys", parent: "Surf Rock", type: "Artist", pop: 0.45, meta: ["An American rock band formed in Hawthorne, California, in 1961, known for their vocal harmonies and lyrics reflecting a Southern California youth culture."] },
        { id: "Sublime", parent: "Ska Punk", type: "Artist", pop: 0.45, meta: ["An American ska punk band from Long Beach, California, formed in 1988."] },
        { id: "Nine Inch Nails", parent: "Industrial Rock", type: "Artist", pop: 0.45, meta: ["An American industrial rock band formed in 1988 in Cleveland, Ohio, by Trent Reznor."] },
        { id: "Nobuo Uematsu", parent: "Video Game Music", type: "Artist", pop: 0.45, meta: ["A Japanese video game composer and musician, best known for his work on the 'Final Fantasy' series."] },
        { id: "Blur", parent: "Britpop", type: "Artist", pop: 0.43, meta: ["An English rock band formed in London in 1988, a leading band of the Britpop movement."] },
        { id: "Public Enemy", parent: "Conscious Hip-Hop", type: "Artist", pop: 0.43, meta: ["An American hip hop group consisting of Chuck D, Flavor Flav, and DJ Lord, known for their politically charged music."] },
        { id: "The Chemical Brothers", parent: "Electronic", type: "Artist", pop: 0.43, meta: ["An English electronic music duo composed of Tom Rowlands and Ed Simons, pioneers of the big beat genre."] },
        { id: "Bon Iver", parent: "Indie Folk", type: "Artist", pop: 0.43, meta: ["An American indie folk band founded in 2006 by singer-songwriter Justin Vernon."] },
        { id: "Duke Ellington", parent: "Big Band", type: "Artist", pop: 0.43, meta: ["An American composer, pianist, and leader of a jazz orchestra, which he led from 1923 until his death."] },
        { id: "The Lumineers", parent: "Indie Folk", type: "Artist", pop: 0.43, meta: ["An American folk rock band based in Denver, Colorado."] },
        { id: "Joy Division", parent: "Post-Punk", type: "Artist", pop: 0.41, meta: ["An English rock band formed in Salford in 1976, one of the most influential bands of the post-punk era."] },
        { id: "Utada Hikaru", parent: "J-Pop", type: "Artist", pop: 0.41, meta: ["A Japanese singer-songwriter and producer, one of Japan's most successful and influential artists."] },
        { id: "Flume", parent: "Electronic", type: "Artist", pop: 0.41, meta: ["An Australian musician, DJ and record producer, considered a pioneer of the future bass genre."] },
        { id: "Dream Theater", parent: "Progressive Metal", type: "Artist", pop: 0.41, meta: ["An American progressive metal band formed in 1985, one of the 'big three' of the progressive metal genre."] },
        { id: "Thelonious Monk", parent: "Bebop", type: "Artist", pop: 0.41, meta: ["An American jazz pianist and composer, who had a unique improvisational style."] },
        { id: "Bill Evans", parent: "Jazz", type: "Artist", pop: 0.41, meta: ["An American jazz pianist and composer who mostly worked in a trio setting."] },
        { id: "Parliament", parent: "P-Funk", type: "Artist", pop: 0.41, meta: ["An American funk band formed in the late 1960s by George Clinton, part of the Parliament-Funkadelic collective."] },
        { id: "Fleet Foxes", parent: "Indie Folk", type: "Artist", pop: 0.41, meta: ["An American indie folk band founded in 2006 by singer-songwriter Justin Vernon."] },
        { id: "Enya", parent: "New Age", type: "Artist", pop: 0.41, meta: ["An Irish singer, songwriter, and musician, known for her distinctive sound, characterized by voice-layering and ethereal soundscapes."] },
        { id: "Brian Eno", parent: "Ambient", type: "Artist", pop: 0.4, meta: ["An English musician, record producer, and visual artist, known as one of the principal innovators of ambient music."] },
        { id: "J Dilla", parent: "Lo-fi Hip Hop", type: "Artist", pop: 0.4, meta: ["An American record producer and rapper who emerged in the mid-1990s underground hip hop scene in Detroit, Michigan."] },
        { id: "The Specials", parent: "2 Tone", type: "Artist", pop: 0.4, meta: ["An English 2 tone and ska revival band formed in 1977 in Coventry."] },
        { id: "Fela Kuti", parent: "Afrobeat", type: "Artist", pop: 0.4, meta: ["A Nigerian multi-instrumentalist, musician, composer, and pioneer of the Afrobeat music genre."] },
        { id: "My Bloody Valentine", parent: "Shoegaze", type: "Artist", pop: 0.38, meta: ["An Irish-English alternative rock band formed in Dublin in 1983, pioneers of the shoegaze genre."] },
        { id: "Skepta", parent: "Grime", type: "Artist", pop: 0.38, meta: ["A British grime MC, rapper, songwriter and record producer from Tottenham, North London."] },
        { id: "Aphex Twin", parent: "IDM", type: "Artist", pop: 0.38, meta: ["The alias of Richard D. James, an Irish-born British electronic musician and composer, known for his influential and idiosyncratic work."] },
        { id: "Opeth", parent: "Progressive Metal", type: "Artist", pop: 0.38, meta: ["A Swedish progressive metal band from Stockholm, formed in 1989."] },
        { id: "Jason Isbell", parent: "Americana", type: "Artist", pop: 0.38, meta: ["An American singer-songwriter and guitarist, known for his solo career and as a former member of the Drive-By Truckers."] },
        { id: "Philip Glass", parent: "Minimalism", type: "Artist", pop: 0.38, meta: ["An American composer and pianist, widely regarded as one of the most influential composers of the late 20th century."] },
        { id: "Dave Brubeck", parent: "Cool Jazz", type: "Artist", pop: 0.43, meta: ["An American jazz pianist and composer, considered one of the foremost exponents of cool jazz."] },
        { id: "Boards of Canada", parent: "IDM", type: "Artist", pop: 0.36, meta: ["A Scottish electronic music duo consisting of brothers Michael Sandison and Marcus Eoin."] },
        { id: "Toro y Moi", parent: "Chillwave", type: "Artist", pop: 0.34, meta: ["The professional name of Chaz Bear, an American singer, songwriter, and record producer, a prominent figure in the chillwave genre."] },
        { id: "Macintosh Plus", parent: "Vaporwave", type: "Artist", pop: 0.3, meta: ["An alias of Ramona Xavier, an American electronic musician and graphic artist, whose album 'Floral Shoppe' is considered a defining work of the vaporwave genre."] }
    ];


    // DPR scaling
    function resizeCanvas() {
        const DPR = window.devicePixelRatio || 1;
        canvas.width = Math.floor(canvas.clientWidth * DPR);
        canvas.height = Math.floor(canvas.clientHeight * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const nodeMap = Object.fromEntries(rawNodes.map(n => [n.id, n]));

    const getType = (n) => {
        if (!n.parent) return "Root";
        const parent = nodeMap[n.parent];
        if (!parent.parent) return "Family"; // child of Root
        const grandparent = nodeMap[parent.parent];
        return grandparent ? "Artist" : "Subgenre";
    };

    // Build nodes and links
    const nodes = rawNodes.map((n) => ({
        id: n.id,
        type: n.type || getType(n),
        pop: n.pop || 0.4,
        meta: n.meta || [],
        parent: n.parent || null,
        x: 0,
        y: 0,
        vx: 0, vy: 0,
        r: 5 + (n.pop || 0.3) * 8,
        fixed: false
    }));

    const nodeById = new Map(nodes.map(n => [n.id, n]));

    const links = [];
    nodes.forEach(n => {
        if (n.parent && nodeById.has(n.parent)) {
            links.push({ source: n.id, target: n.parent, strength: 0.01 });
        }
    });

    // Additional loosely connected links (families related by vibe)
    // const familyPairs = [["Rock", "Electronic"], ["Pop", "Electronic"], ["Jazz", "Electronic"], ["Hip-Hop", "Pop"]];
    // familyPairs.forEach(([a, b]) => {
    //     if (nodeById.has(a) && nodeById.has(b)) links.push({ source: a, target: b, strength: 0.01, dashed: true });
    // });

    // Simulation variables
    const repulsion = 20000; // higher => more spread
    const friction = 0.8;
    const springBase = 0.001;
    const dt = 1;

    // View transform
    const view = { x: 0, y: 0, scale: 1 };
    const targetView = { x: 0, y: 0, scale: 1 };
    let dragging = false, dragOrigin = null;
    let lastMouse = { x: 0, y: 0 };

    // Label toggle
    let showLabels = true;

    // Utility: world -> screen
    function worldToScreen(wx, wy) {
        const cx = canvas.clientWidth / 2, cy = canvas.clientHeight / 2;
        return {
            x: cx + (wx + view.x) * view.scale,
            y: cy + (wy + view.y) * view.scale
        };
    }
    function screenToWorld(sx, sy) {
        const cx = canvas.clientWidth / 2, cy = canvas.clientHeight / 2;
        return {
            x: (sx - cx) / view.scale - view.x,
            y: (sy - cy) / view.scale - view.y
        };
    }

    // Interaction: hover & selection
    let hovered = null;
    let selected = null;

    function findNodeAtScreen(x, y) {
        const world = screenToWorld(x, y);
        for (let i = nodes.length - 1; i >= 0; i--) {
            const n = nodes[i];
            const dx = world.x - n.x, dy = world.y - n.y;
            if (Math.sqrt(dx * dx + dy * dy) < (n.r + 6) / view.scale) return n;
        }
        return null;
    }

    // Main simulation step
    function stepSimulation() {
        // spring forces from links
        links.forEach(l => {
            const a = nodeById.get(l.source), b = nodeById.get(l.target);
            if (!a || !b) return;
            const dx = b.x - a.x, dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const desired = 200 * (1 / (a.pop + b.pop)); // dynamic rest length
            const k = (l.strength || springBase);
            const fx = k * (dist - desired) * (dx / dist);
            const fy = k * (dist - desired) * (dy / dist);
            if (!a.fixed) { a.vx += fx; a.vy += fy; }
            if (!b.fixed) { b.vx -= fx; b.vy -= fy; }
        });

        // repulsion (O(n^2) - OK for small data)
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                let dx = b.x - a.x, dy = b.y - a.y;
                let d2 = dx * dx + dy * dy + 0.01;
                let inv = 1 / Math.sqrt(d2);
                let force = repulsion / d2;
                let fx = force * dx * inv;
                let fy = force * dy * inv;
                if (!a.fixed) { a.vx -= fx; a.vy -= fy; }
                if (!b.fixed) { b.vx += fx; b.vy += fy; }
            }
        }

        // center gravity toward families: families attract subgenres
        nodes.forEach(n => {
            if (n.type === "Root") {
                // Keep root near the center (strong pull)
                const k = 0.009;
                n.vx += (-n.x) * k;
                n.vy += (-n.y) * k;

            } else if (n.type === "Family") {
                // Families gently pulled toward the Root (center)
                const k = 0.006;
                n.vx += (-n.x) * k;
                n.vy += (-n.y) * k;

            } else if (n.type === "Subgenre") {
                // Subgenres pulled slightly toward their Family
                const p = nodeById.get(n.parent);
                if (p && !n.fixed) {
                    const k = 0.005;
                    n.vx += (p.x - n.x) * k;
                    n.vy += (p.y - n.y) * k;
                }

            } else if (n.type === "Artist") {
                // Artists pulled toward their Subgenre (or Family if direct child)
                const p = nodeById.get(n.parent);
                if (p && !n.fixed) {
                    const k = 0.004; // maybe stronger so artists cluster tighter
                    n.vx += (p.x - n.x) * k;
                    n.vy += (p.y - n.y) * k;
                }
            }
        });


        // integrate
        nodes.forEach(n => {
            if (!n.fixed) {
                n.vx *= friction; n.vy *= friction;
                n.x += n.vx * dt;
                n.y += n.vy * dt;
            }
        });
    }

    function setupNodeList(nodes, nodeById, view, targetView) {
        const nodeList = document.getElementById("nodeList");
        nodeList.innerHTML = ""; // Clear the list

        // This function simply sets the destination for the animation loop.
        function focusOnNode(node) {
            if (!node) return;

            const desiredScale = Math.max(0.9, Math.min(1.8, 1.0 / Math.max(0.12, node.r / 12)));

            // Compute target view using direct, absolute world coordinates
            const tx = -node.x;
            const ty = -node.y;

            targetView.scale = desiredScale;
            targetView.x = tx;
            targetView.y = ty;

            // Set the node as selected for highlighting
            selected = node;
        }

        // Build the list and attach click listeners
        nodes.forEach(n => {
            const li = document.createElement("li");
            li.textContent = `${n.type} -> ${n.id}`;
            li.style.cursor = "pointer";
            updateTooltip();

            li.addEventListener("click", () => {
                const node = nodeById.get(n.id);

                if (node) {


                    // Just call focusOnNode. The main tick() loop will handle the animation.

                    focusOnNode(node);
                    showInfo(node);
                } else {
                    console.warn("Node not found for id:", n.id);
                }
            });

            nodeList.appendChild(li);
        });
    }
    setupNodeList(nodes, nodeById, view, targetView); // <-- Pass it in here

    // Rendering
    function draw() {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        // const cx = canvas.clientWidth / 2, cy = canvas.clientHeight / 2;

        // smooth view interpolation
        view.x += (targetView.x - view.x) * 0.14;
        view.y += (targetView.y - view.y) * 0.14;
        view.scale += (targetView.scale - view.scale) * 0.12;

        // background stars (simple parallax)
        drawBackground();

        // transform to world coordinates by applying view transform manually per node
        // draw links
        // get CSS variables
        const rootStyles = getComputedStyle(document.documentElement);


        // draw links
        ctx.save();
        ctx.lineCap = 'round';
        links.forEach(l => {
            // skip dashed links
            if (l.dashed) return; // <-- commented/ignored dashed lines

            const a = nodeById.get(l.source), b = nodeById.get(l.target);
            if (!a || !b) return;

            const pa = worldToScreen(a.x, a.y), pb = worldToScreen(b.x, b.y);

            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.lineWidth = 0.9 * Math.max(0.6, view.scale);

            // get CSS variable for solid links
            const rootStyles = getComputedStyle(document.documentElement);
            const lineColor = rootStyles.getPropertyValue('--line').trim();

            ctx.strokeStyle = lineColor;
            ctx.setLineDash([]); // ensure solid line
            ctx.stroke();
        });
        ctx.restore();

        // // draw links
        // ctx.save();
        // ctx.lineCap = 'round';
        // links.forEach(l => {
        //   const a = nodeById.get(l.source), b = nodeById.get(l.target);
        //   if (!a || !b) return;
        //   const pa = worldToScreen(a.x, a.y), pb = worldToScreen(b.x, b.y);

        //   ctx.beginPath();
        //   ctx.moveTo(pa.x, pa.y);
        //   ctx.lineTo(pb.x, pb.y);
        //   ctx.lineWidth = (l.dashed ? 0.6 : 0.9) * Math.max(0.6, view.scale);
        //   ctx.strokeStyle = l.dashed ? lineDashedColor : lineColor;

        //   if (l.dashed) {
        //     ctx.setLineDash([4, 4]);
        //     ctx.lineDashOffset = 0;
        //   } else ctx.setLineDash([]);

        //   ctx.stroke();
        // });
        // ctx.restore();

        // draw nodes
        nodes.forEach(n => {
            const p = worldToScreen(n.x, n.y);

            // get colors from CSS variables
            const rootStyles = getComputedStyle(document.documentElement);
            const colorFamily = rootStyles.getPropertyValue('--muted').trim();    // Family nodes

            // determine base color for glow and core
            // get CSS variables once
            const typeColors = {
                "Root": rootStyles.getPropertyValue('--color-root').trim() || "#ff3d81",
                "Family": rootStyles.getPropertyValue('--color-family').trim() || "#ff9f1c",
                "Subgenre": rootStyles.getPropertyValue('--color-subgenre').trim() || "#00ffff",
                "Artist": rootStyles.getPropertyValue('--color-artist').trim() || "#a0f0ff"
            };

            let baseColor;
            if (selected === n) baseColor = rootStyles.getPropertyValue('--accent-2').trim();
            else if (hovered === n) baseColor = rootStyles.getPropertyValue('--accent').trim();
            else baseColor = typeColors[n.type] || "#aaaaaa"; // fallback gray


            // helper to convert hex to rgba
            function hexToRgba(hex, alpha) {
                hex = hex.replace('#', '');
                if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
                const r = parseInt(hex.substr(0, 2), 16);
                const g = parseInt(hex.substr(2, 2), 16);
                const b = parseInt(hex.substr(4, 2), 16);
                return `rgba(${r},${g},${b},${alpha})`;
            }

            // glow
            const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(12, n.r * 6 * view.scale));
            grd.addColorStop(0, hexToRgba(baseColor, 0.22));
            grd.addColorStop(0.25, hexToRgba(baseColor, 0.09));
            grd.addColorStop(1, 'rgba(2,8,12,0)');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(10, n.r * 6 * view.scale), 0, Math.PI * 2);
            ctx.fill();

            // star core
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(2.2, n.r * view.scale), 0, Math.PI * 2);
            ctx.fillStyle = baseColor;
            ctx.fill();

            // subtle ring for families

            if (n.type === 'Root') {
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(6, n.r * 3.6 * view.scale), 0, Math.PI * 2);
                ctx.lineWidth = 0.6 * view.scale;
                ctx.strokeStyle = hexToRgba(colorFamily, 0.1);
                ctx.stroke();
            }
            if (n.type === 'Family') {
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(5, n.r * 3.6 * view.scale), 0, Math.PI * 2);
                ctx.lineWidth = 0.6 * view.scale;
                ctx.strokeStyle = hexToRgba(colorFamily, 0.1);
                ctx.stroke();
            }
            if (n.type === 'Subgenre') {
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(4, n.r * 3.6 * view.scale), 0, Math.PI * 2);
                ctx.lineWidth = 0.6 * view.scale;
                ctx.strokeStyle = hexToRgba(colorFamily, 0.1);
                ctx.stroke();
            }
            if (n.type === 'Style') {
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(3, n.r * 3.6 * view.scale), 0, Math.PI * 2);
                ctx.lineWidth = 0.6 * view.scale;
                ctx.strokeStyle = hexToRgba(colorFamily, 0.1);
                ctx.stroke();
            }
            if (n.type === 'Artist') {
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(2, n.r * 3.6 * view.scale), 0, Math.PI * 2);
                ctx.lineWidth = 0.6 * view.scale;
                ctx.strokeStyle = hexToRgba(colorFamily, 0.1);
                ctx.stroke();
            }
        });

        // labels (optional)
        if (showLabels) {
            ctx.save();
            ctx.font = '12px system-ui, Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            nodes.forEach(n => {
                const p = worldToScreen(n.x, n.y);
                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                ctx.globalAlpha = 0.9;
                ctx.fillText(n.id, p.x, p.y + (n.r * view.scale + 6));
            });
            ctx.restore();
        }

        // selection outline
        if (selected) {
            const p = worldToScreen(selected.x, selected.y);
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(14, selected.r * 5 * view.scale), 0, Math.PI * 2);
            ctx.lineWidth = 2 * Math.max(0.6, view.scale);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.40)';
            ctx.stroke();
        }
    }

    // background simple stars (world-space positions)
    const bgStars = Array.from({ length: 800 }, () => ({   // increased count for full coverage
        x: (Math.random() - 0.5) * 5000,  // spread stars over large world area
        y: (Math.random() - 0.5) * 5000,
        s: Math.random() * 1.6,           // radius
        a: Math.random() * 0.8 + 0.2      // alpha
    }));

    function drawBackground() {
        const rootStyles = getComputedStyle(document.documentElement);
        const bgColor = rootStyles.getPropertyValue('--bg-end').trim();

        ctx.save();
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        // draw stars in world space with parallax
        bgStars.forEach(s => {
            ctx.globalAlpha = s.a;

            // project star from world space -> screen space (with parallax effect)
            const x = (s.x + view.x * 0.3) * view.scale + canvas.clientWidth / 2;
            const y = (s.y + view.y * 0.3) * view.scale + canvas.clientHeight / 2;

            ctx.beginPath();
            ctx.arc(x, y, s.s, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
        });

        ctx.globalAlpha = 1;
        ctx.restore();
    }


    // Loop
    function tick() {
        for (let i = 0; i < 2; i++) stepSimulation();
        draw();
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);



    // Loop
    function tick() {
        // run a few simulation steps per frame (stability)
        for (let i = 0; i < 2; i++) stepSimulation();
        draw();
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);


    // tooltip management
    function updateTooltip() {
        if (hovered) {
            tooltip.innerHTML = `<strong>${hovered.id}</strong>
            <div class="small" style="margin-top:6px;color:var(--muted)">
                Type: ${hovered.type}${hovered.parent ? ' • Parent: ' + hovered.parent : ''}
            </div>
            <div style="margin-top:8px;font-size:13px">
                Meta: <em style="color:var(--muted)">${(hovered.meta && hovered.meta[0]) ? hovered.meta[0].substring(0, 50) + '... Click and read in the bottom left sector!' : 'No meta available.'}</em>
            </div>
            <div style="margin-top:8px;color:var(--muted);font-size:12px">
                Click a different node to focus or drag to explore.
            </div>`;
            tooltip.style.left = (lastMouse.x - 320) + 'px';
            tooltip.style.top = (lastMouse.y + 10) + 'px';
            tooltip.classList.add('visible');
        } else {
            tooltip.classList.remove('visible');
        }
    }


    canvas.addEventListener('mousemove', (ev) => {
        // Get mouse position relative to the canvas for hit detection
        const rect = canvas.getBoundingClientRect();
        const canvasX = ev.clientX - rect.left;
        const canvasY = ev.clientY - rect.top;

        // Use pageX/pageY for positioning the tooltip itself
        lastMouse.x = ev.pageX;
        lastMouse.y = ev.pageY;

        // --- LOGIC CHANGE IS HERE ---

        // For debugging, we unconditionally update 'hovered' and call the tooltip function.
        // This removes the (node !== hovered) check that was preventing updates.
        hovered = findNodeAtScreen(canvasX, canvasY);
        updateTooltip();

        // Add a log to see what findNodeAtScreen is returning
        // console.log("Node under cursor:", hovered ? hovered.id : null);


        // Your drag logic remains untouched
        if (dragging && dragOrigin) {
            const dx = ev.clientX - dragOrigin.x, dy = ev.clientY - dragOrigin.y;
            targetView.x += dx / view.scale;
            targetView.y += dy / view.scale;
            dragOrigin = { x: ev.clientX, y: ev.clientY };
        }
    });

    canvas.addEventListener('wheel', (ev) => {
        ev.preventDefault();
        const delta = -ev.deltaY * 0.0015;
        const oldScale = targetView.scale;
        let newScale = targetView.scale * (1 + delta);
        newScale = Math.max(0.28, Math.min(3.4, newScale));

        // zoom toward mouse position
        const rect = canvas.getBoundingClientRect();
        const mx = ev.clientX - rect.left, my = ev.clientY - rect.top;
        const worldBefore = screenToWorld(mx, my);
        targetView.scale = newScale;
        const worldAfter = screenToWorld(mx, my);
        targetView.x += worldAfter.x - worldBefore.x;
        targetView.y += worldAfter.y - worldBefore.y;
    }, { passive: false });

    // dragging for pan
    canvas.addEventListener('mousedown', (ev) => {
        dragging = true;
        dragOrigin = { x: ev.clientX, y: ev.clientY };
        canvas.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup', (ev) => {
        if (dragging) {
            dragging = false;
            dragOrigin = null;
            canvas.style.cursor = 'grab';
        }
    });

    // click to select / focus
    canvas.addEventListener('click', (ev) => {
        // Start a log group for this entire click event
        // console.group('[CANVAS CLICK]');

        const rect = canvas.getBoundingClientRect();
        const clickX = ev.clientX - rect.left;
        const clickY = ev.clientY - rect.top;

        // console.log("📍 Click coordinates (in canvas space):", { x: clickX.toFixed(2), y: clickY.toFixed(2) });

        const node = findNodeAtScreen(clickX, clickY);

        if (node) {
            // console.log("✅ Node found at click location:", node);

            selected = node;
            focusOnNode(node); // This function now contains its own detailed logs
            showInfo(node);

        } else {
            // console.log("❌ No node found at click location.");
            selected = null;
            showInfo(null);
        }

        updateTooltip();
        // console.log("➡️ Selected node is now:", selected ? selected.id : 'null');

        // End the main log group
        // console.groupEnd();
    });

    /**
     * Focus animation: centers the node in the view with moderate zoom.
     * This function is now enhanced with its own logging.
     * @param {object} node - The node object to focus on.
     */
    function focusOnNode(node) {
        // Start a nested group for the focus action
        // console.group(`🎯 Focusing on: ${node.id}`);

        const desiredScale = Math.max(0.9, Math.min(1.8, 1.0 / Math.max(0.12, node.r / 12)));
        // console.log("🔎 Calculated new scale:", desiredScale.toFixed(2));

        // Compute target view so node maps to center
        const tx = -node.x;
        const ty = -node.y;
        // console.log("🗺️ Calculated target pan (tx, ty):", { x: tx.toFixed(2), y: ty.toFixed(2) });

        // Log the target view state BEFORE the change
        // console.log("👁️ Target view state BEFORE:", { x: targetView.x.toFixed(2), y: targetView.y.toFixed(2), scale: targetView.scale.toFixed(2) });

        targetView.scale = desiredScale;
        targetView.x = tx;
        targetView.y = ty;

        // console.log("✅ Target view state AFTER:", { x: targetView.x.toFixed(2), y: targetView.y.toFixed(2), scale: targetView.scale.toFixed(2) });

        // End the nested log group
        // console.groupEnd();
    }



    // keyboard accessibility for nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
        item.addEventListener('keydown', (e) => { if (e.key === 'Enter') item.click(); });
    });

    function showInfo(node) {
        if (!node) {
            infoContent.innerHTML = 'Hover a star to see genre. Click to fix focus and show quick info.';
            return;
        }
        infoContent.innerHTML = `<strong>${node.id}</strong><div class="small" style="margin-top:6px;color:var(--muted)">Type: ${node.type}${node.parent ? ' • Parent: ' + node.parent : ''}</div>
    <div style="margin-top:8px;font-size:13px">Meta: <em style="color:var(--muted)">${node.meta.slice(0, 3).join(', ')}</em></div>
      <div style="margin-top:8px;color:var(--muted);font-size:12px">Click a different node to focus or drag to explore.</div>`;
    }



    // Buttons
    shuffleBtn.addEventListener('click', () => {
        // Apply heavy blur immediately
        canvas.style.filter = 'blur(40px)';

        // Gradually move nodes to new random positions over 2 seconds
        const duration = 10; // ms
        const startTime = performance.now();
        const startPositions = nodes.map(n => ({ x: n.x, y: n.y }));
        const endPositions = nodes.map(n => ({
            x: (Math.random() - 0.5) * 2000,
            y: (Math.random() - 0.5) * 2000
        }));

        function animateShuffle(time) {
            const t = Math.min(1, (time - startTime) / duration);
            nodes.forEach((n, i) => {
                n.x = startPositions[i].x + (endPositions[i].x - startPositions[i].x) * t;
                n.y = startPositions[i].y + (endPositions[i].y - startPositions[i].y) * t;
                n.vx = n.vy = 0; // stop existing velocity
            });

            if (t < 1) requestAnimationFrame(animateShuffle);
            else {
                // Remove blur smoothly after animation
                canvas.style.transition = 'filter 2s cubic-bezier( 1, 0, 0.90, 0.41 )';
                canvas.style.filter = 'blur(0px)';
                setTimeout(() => {
                    canvas.style.transition = '';
                }, 1000);
            }
        }

        requestAnimationFrame(animateShuffle);
    });



    resetBtn.addEventListener('click', () => {
        // CORRECT: Modify the properties of the *existing* targetView object.
        // This allows the draw() loop to see the change and start the animation.
        targetView.x = 0;
        targetView.y = 0;
        targetView.scale = 1;

        // Clear selection and hover states
        selected = null;
        hovered = null;

        // Update UI elements
        updateTooltip(); // Hide any visible tooltip
        infoContent.innerHTML = 'View reset. Hover a star to see genre. Click to focus.';
    });

    // This function was already correct, included for completeness.
    toggleLabelsBtn.addEventListener('click', () => {
        showLabels = !showLabels;
        toggleLabelsBtn.textContent = showLabels ? 'Hide labels' : 'Show labels';
    });

    // initial info
    infoContent.innerHTML = 'Hover a star to see genre. Click to focus and show quick info. Use mouse wheel to zoom, drag to pan.';

    // minor performance: pause simulation on background tab
    document.addEventListener('visibilitychange', () => {
        running = document.visibilityState === 'visible';
    });

    // Seed small centering: place major families around center
    (function placeFamilies() {
        const families = nodes.filter(n => n.type === 'Subgenre');
        // const radius = 10;
        families.forEach((f, i) => {
            f.x = 0;
            f.y = 0;
        });
        // place subgenres closer to their parents
        nodes.filter(n => n.parent).forEach(n => {
            const p = nodeById.get(n.parent);
            if (p) {
                n.x = p.x + (Math.random() - 0.1) * 50;
                n.y = p.y + (Math.random() - 0.1) * 50;
            }
        });
    })();

    const burger = document.getElementById('burgerMenu');
    const nav = document.querySelector('nav.side');

    // Toggle sidebar on burger click
    burger.addEventListener('click', () => {
        nav.classList.add('open');
        burger.style.display = 'none';
    });

    // Click outside to close sidebar
    document.addEventListener('click', (e) => {
        const isClickInsideNav = nav.contains(e.target);
        const isClickOnBurger = burger.contains(e.target);

        if (!isClickInsideNav && !isClickOnBurger && nav.classList.contains('open')) {
            nav.classList.remove('open');
            burger.style.display = 'flex';
        }
    });


    // tweak on start
    // targetView = { x: 0, y: 0, scale: 1.0 };

})();

