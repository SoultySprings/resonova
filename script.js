/*
    Music Genre Galaxy
    Single-file interactive visualization with minimal CSS.
    Features:
     - nodes = genres, links = influences/subgenre relations
     - simple force simulation + repulsion
     - pan & zoom, hover tooltip, click to select
    */

(() => {
    const canvas = document.getElementById('galaxy');
    const ctx = canvas.getContext('2d', { alpha: true });
    const tooltip = document.getElementById('tooltip');
    const infoContent = document.getElementById('infoContent');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const resetBtn = document.getElementById('resetBtn');
    const toggleLabelsBtn = document.getElementById('toggleLabelsBtn');

    // DPR scaling
    function resizeCanvas() {
        const DPR = window.devicePixelRatio || 1;
        canvas.width = Math.floor(canvas.clientWidth * DPR);
        canvas.height = Math.floor(canvas.clientHeight * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Sample dataset (small, extendable)
    const rawNodes = [
        // Root
        { id: "Music", type: "Root", pop: 1.0, meta: ["The universal category encompassing all musical genres and styles."] },

        // Families
        { id: "Rock", parent: "Music", type: "Family", pop: 1.0, meta: ["A genre characterized by strong rhythms, guitars, and expressive vocals."] },
        { id: "Pop", parent: "Music", type: "Family", pop: 1.0, meta: ["Popular music with catchy melodies and broad appeal."] },
        { id: "Electronic", parent: "Music", type: "Family", pop: 0.9, meta: ["Music created primarily using electronic instruments and digital production."] },
        { id: "Jazz", parent: "Music", type: "Family", pop: 0.6, meta: ["A genre noted for improvisation, swing rhythms, and complex harmonies."] },
        { id: "Hip-Hop", parent: "Music", type: "Family", pop: 1.0, meta: ["A genre featuring rap, beats, DJing, and urban culture influence."] },
        { id: "Metal", parent: "Music", type: "Family", pop: 0.8, meta: ["A heavier, aggressive style of rock with distorted guitars and powerful vocals."] },
        { id: "Folk", parent: "Music", type: "Family", pop: 0.5, meta: ["Music often rooted in traditional storytelling and acoustic instruments."] },
        { id: "Classical", parent: "Music", type: "Family", pop: 0.7, meta: ["Orchestral and composed music spanning Baroque to contemporary eras."] },
        { id: "Reggae", parent: "Music", type: "Family", pop: 0.6, meta: ["A genre originating in Jamaica with offbeat rhythms and socially conscious lyrics."] },
        { id: "Funk", parent: "Music", type: "Family", pop: 0.7, meta: ["Rhythmic music emphasizing groove, basslines, and danceable beats."] },

        // Subgenres
        { id: "Alternative Rock", parent: "Rock", type: "Subgenre", pop: 0.7, meta: ["A subgenre of rock known for its experimental and independent approach."] },
        { id: "Hard Rock", parent: "Rock", type: "Subgenre", pop: 0.5, meta: ["Rock style with heavier guitars and stronger riffs."] },
        { id: "Progressive Rock", parent: "Rock", type: "Subgenre", pop: 0.3, meta: ["Rock featuring complex structures and experimental elements."] },
        { id: "Punk Rock", parent: "Rock", type: "Subgenre", pop: 0.4, meta: ["Fast, energetic rock with rebellious themes."] },
        { id: "Grunge", parent: "Rock", type: "Subgenre", pop: 0.4, meta: ["A raw, heavy rock subgenre popularized in the 1990s."] },

        { id: "Synth-pop", parent: "Pop", type: "Subgenre", pop: 0.5, meta: ["Pop music heavily using synthesizers and electronic sounds."] },
        { id: "K-Pop", parent: "Pop", type: "Subgenre", pop: 0.8, meta: ["Korean pop music combining catchy tunes, visuals, and dance."] },
        { id: "Dance Pop", parent: "Pop", type: "Subgenre", pop: 0.6, meta: ["Upbeat pop music designed for dancing."] },
        { id: "Teen Pop", parent: "Pop", type: "Subgenre", pop: 0.5, meta: ["Pop targeting teenage audiences with catchy hooks."] },
        { id: "Electropop", parent: "Pop", type: "Subgenre", pop: 0.5, meta: ["Pop music with strong electronic influences."] },

        { id: "House", parent: "Electronic", type: "Subgenre", pop: 0.7, meta: ["Electronic dance music with steady 4/4 beats and repetitive rhythms."] },
        { id: "Techno", parent: "Electronic", type: "Subgenre", pop: 0.6, meta: ["Electronic music focused on repetitive beats and futuristic sounds."] },
        { id: "Ambient", parent: "Electronic", type: "Subgenre", pop: 0.4, meta: ["Atmospheric electronic music emphasizing mood and texture."] },
        { id: "Trance", parent: "Electronic", type: "Subgenre", pop: 0.5, meta: ["Electronic genre with melodic, hypnotic rhythms for dancing."] },
        { id: "Dubstep", parent: "Electronic", type: "Subgenre", pop: 0.4, meta: ["Electronic music with wobbling bass and syncopated rhythms."] },

        { id: "Bebop", parent: "Jazz", type: "Subgenre", pop: 0.3, meta: ["Fast-paced, intricate jazz style emphasizing improvisation."] },
        { id: "Swing", parent: "Jazz", type: "Subgenre", pop: 0.3, meta: ["Jazz style with a strong rhythm and danceable feel."] },
        { id: "Fusion", parent: "Jazz", type: "Subgenre", pop: 0.3, meta: ["Jazz blended with rock, funk, and other genres."] },
        { id: "Smooth Jazz", parent: "Jazz", type: "Subgenre", pop: 0.4, meta: ["Jazz with a relaxed, polished sound."] },

        { id: "Trap", parent: "Hip-Hop", type: "Subgenre", pop: 0.9, meta: ["Hip-Hop style featuring 808 drums and modern rap rhythms."] },
        { id: "Conscious Hip-Hop", parent: "Hip-Hop", type: "Subgenre", pop: 0.4, meta: ["Hip-Hop focused on social and political awareness."] },
        { id: "Old School Hip-Hop", parent: "Hip-Hop", type: "Subgenre", pop: 0.3, meta: ["Early hip-hop emphasizing party vibes and lyricism."] },
        { id: "Boom Bap", parent: "Hip-Hop", type: "Subgenre", pop: 0.4, meta: ["Classic hip-hop style with punchy drum beats."] },

        { id: "Heavy Metal", parent: "Metal", type: "Subgenre", pop: 0.6, meta: ["Loud, aggressive rock style with powerful guitar riffs."] },
        { id: "Thrash Metal", parent: "Metal", type: "Subgenre", pop: 0.4, meta: ["Fast, aggressive metal emphasizing speed and precision."] },
        { id: "Power Metal", parent: "Metal", type: "Subgenre", pop: 0.2, meta: ["Melodic metal with fantasy-themed lyrics."] },
        { id: "Death Metal", parent: "Metal", type: "Subgenre", pop: 0.3, meta: ["Extreme metal with growling vocals and complex riffs."] },

        { id: "Contemporary Folk", parent: "Folk", type: "Subgenre", pop: 0.45, meta: ["Modern folk music with acoustic instrumentation."] },
        { id: "Traditional Folk", parent: "Folk", type: "Subgenre", pop: 0.3, meta: ["Folk music rooted in traditional songs and culture."] },
        { id: "Folk Rock", parent: "Folk", type: "Subgenre", pop: 0.25, meta: ["Fusion of folk and rock elements."] },
        { id: "Indie Folk", parent: "Folk", type: "Subgenre", pop: 0.35, meta: ["Independent folk music with alternative influences."] },

        { id: "Romantic Classical", parent: "Classical", type: "Subgenre", pop: 0.5, meta: ["Classical music from the Romantic era emphasizing emotion."] },
        { id: "Baroque", parent: "Classical", type: "Subgenre", pop: 0.4, meta: ["Ornate classical music from the Baroque period."] },
        { id: "Contemporary Classical", parent: "Classical", type: "Subgenre", pop: 0.3, meta: ["Modern compositions in classical style."] },

        { id: "Roots Reggae", parent: "Reggae", type: "Subgenre", pop: 0.5, meta: ["Traditional reggae with cultural and social themes."] },
        { id: "Dub", parent: "Reggae", type: "Subgenre", pop: 0.4, meta: ["Reggae style emphasizing remixing and heavy bass."] },
        { id: "Dancehall", parent: "Reggae", type: "Subgenre", pop: 0.3, meta: ["Energetic reggae style for dancing and partying."] },

        { id: "Funk Soul", parent: "Funk", type: "Subgenre", pop: 0.6, meta: ["Funk style emphasizing groove and soulful vocals."] },
        { id: "P-Funk", parent: "Funk", type: "Subgenre", pop: 0.5, meta: ["Parliament-Funkadelic influenced funk style."] },
        { id: "Funk Rock", parent: "Funk", type: "Subgenre", pop: 0.3, meta: ["Fusion of funk rhythms with rock music."] },

        // Styles
        { id: "Grunge Style", parent: "Alternative Rock", type: "Style", pop: 0.6, meta: ["Style emphasizing raw, distorted guitars and angst-filled lyrics."] },
        { id: "Alt Style", parent: "Alternative Rock", type: "Style", pop: 0.5, meta: ["Alternative style with experimental and indie elements."] },

        { id: "Hard Style", parent: "Hard Rock", type: "Style", pop: 0.5, meta: ["Hard rock with powerful riffs and high energy."] },
        { id: "Arena Style", parent: "Hard Rock", type: "Style", pop: 0.4, meta: ["Style designed for large concerts and stadium performances."] },

        { id: "Synth Style", parent: "Synth-pop", type: "Style", pop: 0.5, meta: ["Synth-pop style with electronic instrumentation and catchy melodies."] },
        { id: "Teen Synth Style", parent: "Teen Pop", type: "Style", pop: 0.4, meta: ["Youthful, upbeat synth-pop style."] },

        // Artists
        // Artists
        { id: "Nirvana", parent: "Grunge Style", type: "Artist", pop: 0.7, meta: ["Nirvana", "Top Songs: Smells Like Teen Spirit, Come As You Are, Heart-Shaped Box, Lithium", "Top Albums: Nevermind, In Utero"] },
        { id: "Radiohead", parent: "Alt Style", type: "Artist", pop: 0.7, meta: ["Radiohead", "Top Songs: Paranoid Android, Fake Plastic Trees, Karma Police, No Surprises", "Top Albums: OK Computer, Kid A, In Rainbows"] },
        { id: "Foo Fighters", parent: "Alt Style", type: "Artist", pop: 0.6, meta: ["Foo Fighters", "Top Songs: Everlong, The Pretender, Learn to Fly, All My Life", "Top Albums: The Colour and the Shape, There Is Nothing Left to Lose, Wasting Light"] },
        { id: "AC/DC", parent: "Hard Style", type: "Artist", pop: 0.5, meta: ["AC/DC", "Top Songs: Back in Black, Highway to Hell, Thunderstruck, You Shook Me All Night Long", "Top Albums: Back in Black, Highway to Hell, For Those About to Rock"] },
        { id: "Guns N' Roses", parent: "Arena Style", type: "Artist", pop: 0.5, meta: ["Guns N' Roses", "Top Songs: Sweet Child o' Mine, November Rain, Paradise City, Welcome to the Jungle", "Top Albums: Appetite for Destruction, Use Your Illusion I & II, Chinese Democracy"] },
        { id: "Led Zeppelin", parent: "Hard Style", type: "Artist", pop: 0.5, meta: ["Led Zeppelin", "Top Songs: Stairway to Heaven, Whole Lotta Love, Kashmir, Immigrant Song", "Top Albums: Led Zeppelin IV, Physical Graffiti, Houses of the Holy"] },
        { id: "Depeche Mode", parent: "Synth Style", type: "Artist", pop: 0.5, meta: ["Depeche Mode", "Top Songs: Enjoy the Silence, Personal Jesus, Just Can't Get Enough, People Are People", "Top Albums: Violator, Music for the Masses, Black Celebration"] },
        { id: "CHVRCHES", parent: "Teen Synth Style", type: "Artist", pop: 0.5, meta: ["CHVRCHES", "Top Songs: The Mother We Share, Leave a Trace, Clearest Blue, Gun", "Top Albums: The Bones of What You Believe, Every Open Eye, Screen Violence"] },
        { id: "Pet Shop Boys", parent: "Synth Style", type: "Artist", pop: 0.4, meta: ["Pet Shop Boys", "Top Songs: West End Girls, It's a Sin, Go West, Always on My Mind", "Top Albums: Actually, Behaviour, Very"] },
        { id: "BTS", parent: "K-Pop", type: "Artist", pop: 0.8, meta: ["BTS", "Top Songs: Dynamite, Butter, Boy With Luv, Blood Sweat & Tears", "Top Albums: Map of the Soul: 7, BE, Love Yourself: Answer"] },
        { id: "Blackpink", parent: "K-Pop", type: "Artist", pop: 0.8, meta: ["Blackpink", "Top Songs: DDU-DU DDU-DU, Kill This Love, How You Like That, Lovesick Girls", "Top Albums: The Album, Born Pink"] },
        { id: "Daft Punk", parent: "House", type: "Artist", pop: 0.7, meta: ["Daft Punk", "Top Songs: One More Time, Get Lucky, Around the World, Digital Love", "Top Albums: Discovery, Random Access Memories, Homework"] },
        { id: "Calvin Harris", parent: "House", type: "Artist", pop: 0.7, meta: ["Calvin Harris", "Top Songs: Summer, Feel So Close, This Is What You Came For, I'm Not Alone", "Top Albums: 18 Months, Motion, Funk Wav Bounces Vol. 1"] },
        { id: "Avicii", parent: "House", type: "Artist", pop: 0.6, meta: ["Avicii", "Top Songs: Wake Me Up, Hey Brother, Levels, The Nights", "Top Albums: True, Stories, Tim"] },
        { id: "Charlie Parker", parent: "Bebop", type: "Artist", pop: 0.3, meta: ["Charlie Parker", "Top Songs: Ko-Ko, Ornithology, Now's the Time, Yardbird Suite", "Top Albums: Charlie Parker with Strings, Bird and Diz, The Complete Savoy and Dial Master Takes"] },
        { id: "Dizzy Gillespie", parent: "Bebop", type: "Artist", pop: 0.3, meta: ["Dizzy Gillespie", "Top Songs: A Night in Tunisia, Manteca, Salt Peanuts, Groovin' High", "Top Albums: Afro, Dizzy in Greece, The Complete RCA Victor Recordings"] },
        { id: "Migos", parent: "Trap", type: "Artist", pop: 0.9, meta: ["Migos", "Top Songs: Bad and Boujee, Walk It Talk It, Stir Fry, T-Shirt", "Top Albums: Culture, Culture II, Culture III"] },
        { id: "Future", parent: "Trap", type: "Artist", pop: 0.9, meta: ["Future", "Top Songs: Mask Off, Life Is Good, March Madness, Jumpman", "Top Albums: DS2, Future Nostalgia, High Off Life"] },
        { id: "Travis Scott", parent: "Trap", type: "Artist", pop: 0.8, meta: ["Travis Scott", "Top Songs: Sicko Mode, Goosebumps, Antidote, Highest in the Room", "Top Albums: Astroworld, Rodeo, Birds in the Trap Sing McKnight"] },
        { id: "Black Sabbath", parent: "Heavy Metal", type: "Artist", pop: 0.6, meta: ["Black Sabbath", "Top Songs: Iron Man, Paranoid, War Pigs, Fairies Wear Boots", "Top Albums: Paranoid, Master of Reality, Black Sabbath"] },
        { id: "Judas Priest", parent: "Heavy Metal", type: "Artist", pop: 0.5, meta: ["Judas Priest", "Top Songs: Breaking the Law, Painkiller, Living After Midnight, Hell Bent for Leather", "Top Albums: British Steel, Painkiller, Screaming for Vengeance"] },
        { id: "Tchaikovsky", parent: "Romantic Classical", type: "Artist", pop: 0.5, meta: ["Tchaikovsky", "Top Works: 1812 Overture, Swan Lake, The Nutcracker, Piano Concerto No. 1", "Top Albums: Tchaikovsky: The Nutcracker, Tchaikovsky: Swan Lake, Tchaikovsky: 1812 Overture"] },
        { id: "Chopin", parent: "Romantic Classical", type: "Artist", pop: 0.4, meta: ["Chopin", "Top Works: Nocturne in E-flat Major, Op. 9 No. 2, Ballade No. 1 in G minor, Op. 23, Prelude in D-flat Major, Op. 28 No. 15", "Top Albums: Chopin: Nocturnes, Chopin: Ballades, Chopin: Preludes"] },
        { id: "Burning Spear", parent: "Roots Reggae", type: "Artist", pop: 0.5, meta: ["Burning Spear", "Top Songs: Marcus Garvey, Slavery Days, Jah Nuh Dead, The Lion"] },
        { id: "Toots Hibbert", parent: "Roots Reggae", type: "Artist", pop: 0.4, meta: ["Toots Hibbert", "Top Songs: Pressure Drop, 54-46 Was My Number, Monkey Man, Funky Kingston"] },
        { id: "Parliament", parent: "Funk Soul", type: "Artist", pop: 0.6, meta: ["Parliament", "Top Songs: Give Up the Funk (Tear the Roof off the Sucker), Flash Light, Aqua Boogie, Mothership Connection"] },
        { id: "Sly & The Family Stone", parent: "Funk Soul", type: "Artist", pop: 0.5, meta: ["Sly & The Family Stone", "Top Songs: Everyday People, Thank You (Falettinme Be Mice Elf Agin), Family Affair, I Want to Take You Higher"] }
    ];





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
    const selector2 = document.getElementById('paletteSelector');
    const preview = document.getElementById('colorPreview');

    selector2.addEventListener('mousemove', (e) => {
        const option = document.elementFromPoint(e.clientX, e.clientY);
        if (option && option.tagName === 'OPTION') {
            preview.style.background = getComputedStyle(selector).getPropertyValue('--bg') || '#333';
            preview.textContent = option.textContent;
        }
    });

    selector2.addEventListener('mouseleave', () => {
        preview.style.background = 'transparent';
        preview.textContent = "Hover a palette to preview 🎨";
    });

    const selector = document.getElementById('paletteSelector');
    selector.addEventListener('change', (e) => {
        const selected = palettes[e.target.value];
        for (const varName in selected) {
            document.documentElement.style.setProperty(varName, selected[varName]);
        }
    });


    const nodeMap = Object.fromEntries(rawNodes.map(n => [n.id, n]));

    const getType = (n) => {
        if (!n.parent) return "Root";
        const parent = nodeMap[n.parent];
        if (!parent.parent) return "Family"; // child of Root
        const grandparent = nodeMap[parent.parent];
        return grandparent ? "Artist" : "Subgenre";
    };

    // Build nodes and links
    const nodes = rawNodes.map((n, i) => ({
        id: n.id,
        type: n.type || getType(n),
        pop: n.pop || 0.4,
        meta: n.meta || [],
        parent: n.parent || null,
        also: n.also || [],
        x: 0,
        y: 0,
        vx: 0, vy: 0,
        r: 3 + (n.pop || 0.3) * 8,
        fixed: false
    }));

    const nodeById = new Map(nodes.map(n => [n.id, n]));

    const links = [];
    nodes.forEach(n => {
        if (n.parent && nodeById.has(n.parent)) {
            links.push({ source: n.id, target: n.parent, strength: 0.06 });
        }
        // "also" relationships
        if (n.also && n.also.length) {
            n.also.forEach(a => {
                if (nodeById.has(a)) links.push({ source: n.id, target: a, strength: 0.04 });
            });
        }
    });

    // Additional loosely connected links (families related by vibe)
    const familyPairs = [["Rock", "Electronic"], ["Pop", "Electronic"], ["Jazz", "Electronic"], ["Hip-Hop", "Pop"]];
    familyPairs.forEach(([a, b]) => {
        if (nodeById.has(a) && nodeById.has(b)) links.push({ source: a, target: b, strength: 0.01, dashed: true });
    });

    // Simulation variables
    let running = true;
    const repulsion = 1200; // higher => more spread
    const friction = 0.88;
    const springBase = 0.06;
    const dt = 1;

    // View transform
    let view = { x: 0, y: 0, scale: 1 };
    let targetView = { x: 0, y: 0, scale: 1 };
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
            const desired = 120 * (1 / (a.pop + b.pop)); // dynamic rest length
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
            if (n.type === "Family") {
                // families edge towards orbit center (0,0) mildly
                const k = 0.0009;
                n.vx += (-n.x) * k;
                n.vy += (-n.y) * k;
            } else if (n.parent) {
                const p = nodeById.get(n.parent);
                if (p) {
                    // slight pull toward parent center (handled by spring too)
                    if (!n.fixed) {
                        n.vx += (p.x - n.x) * 0.002;
                        n.vy += (p.y - n.y) * 0.002;
                    }
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
        const lineColor = rootStyles.getPropertyValue('--line').trim();
        // const lineDashedColor = rootStyles.getPropertyValue('--line-dashed').trim();


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
            if (n.type === 'Family') {
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(6, n.r * 3.6 * view.scale), 0, Math.PI * 2);
                ctx.lineWidth = 0.6 * view.scale;
                ctx.strokeStyle = hexToRgba(colorFamily, 0.06);
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
            ctx.strokeStyle = 'rgba(106,225,255,0.14)';
            ctx.stroke();
        }
    }

    // background simple stars
    const bgStars = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.clientWidth,
        y: Math.random() * canvas.clientHeight,
        s: Math.random() * 1.6,
        a: Math.random() * 0.8 + 0.2
    }));
    function drawBackground() {
        const rootStyles = getComputedStyle(document.documentElement);
        const bgColor = rootStyles.getPropertyValue('--bg-end').trim(); // get --bg from :root

        ctx.save();
        ctx.fillStyle = bgColor; // use the CSS variable
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        // draw stars
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        bgStars.forEach(s => {
            ctx.globalAlpha = s.a;
            ctx.fillRect(
                (s.x + (view.x * 0.3)) % canvas.clientWidth,
                (s.y + (view.y * 0.3)) % canvas.clientHeight,
                s.s,
                s.s
            );
        });

        ctx.globalAlpha = 1;
        ctx.restore();
    }


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
            tooltip.innerHTML = `<strong style="display:block;margin-bottom:6px">${hovered.id}</strong><small style="color:var(--muted)">Type: ${hovered.type}${hovered.parent ? ' • Parent: ' + hovered.parent : ''}</small>`;
            tooltip.style.left = (lastMouse.x + 16) + 'px';
            tooltip.style.top = (lastMouse.y + 12) + 'px';
            tooltip.classList.add('visible');
        } else {
            tooltip.classList.remove('visible');
        }
    }

    // Interaction handlers
    canvas.addEventListener('mousemove', (ev) => {
        lastMouse.x = ev.clientX; lastMouse.y = ev.clientY;
        const node = findNodeAtScreen(ev.clientX - canvas.getBoundingClientRect().left, ev.clientY - canvas.getBoundingClientRect().top);
        if (node !== hovered) {
            hovered = node;
            updateTooltip();
        }
        if (dragging && dragOrigin) {
            // pan
            const dx = ev.clientX - dragOrigin.x, dy = ev.clientY - dragOrigin.y;
            targetView.x += dx / view.scale;
            targetView.y += dy / view.scale;
            dragOrigin = { x: ev.clientX, y: ev.clientY };
        }
    });

    canvas.addEventListener('mouseleave', () => { hovered = null; updateTooltip(); });
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
        const rect = canvas.getBoundingClientRect();
        const node = findNodeAtScreen(ev.clientX - rect.left, ev.clientY - rect.top);
        if (node) {
            selected = node;
            focusOnNode(node);
            showInfo(node);
        } else {
            selected = null;
            showInfo(null);
        }
        updateTooltip();
    });

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

    // focus animation: center node in view with moderate zoom
    function focusOnNode(node) {
        const desiredScale = Math.max(0.9, Math.min(1.8, 1.0 / Math.max(0.12, node.r / 12)));
        const cx = canvas.clientWidth / 2, cy = canvas.clientHeight / 2;
        // compute target view so node maps to center
        const tx = -node.x;
        const ty = -node.y;
        targetView.scale = desiredScale;
        // small interpolation pan to center the node (with smoothing in draw)
        targetView.x = tx;
        targetView.y = ty;
    }


    // Buttons
    shuffleBtn.addEventListener('click', () => {
        // Apply heavy blur immediately
        canvas.style.filter = 'blur(50px)';

        // Gradually move nodes to new random positions over 2 seconds
        const duration = 2000; // ms
        const startTime = performance.now();
        const startPositions = nodes.map(n => ({ x: n.x, y: n.y }));
        const endPositions = nodes.map(n => ({
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200
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
                canvas.style.transition = 'filter 2s ease-out';
                canvas.style.filter = 'blur(0px)';
                setTimeout(() => {
                    canvas.style.transition = '';
                }, 1500);
            }
        }

        requestAnimationFrame(animateShuffle);
    });



    resetBtn.addEventListener('click', () => {
        targetView = { x: 0, y: 0, scale: 1 };
        selected = null; hovered = null;
        infoContent.innerHTML = 'View reset. Hover a star to see genre. Click to focus.';
    });
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
        const families = nodes.filter(n => n.type === 'Family');
        const radius = 20;
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

    window.addEventListener('load', () => {
        const splash = document.getElementById('splash');

        const progressBar = document.getElementById('progressBar');

        // Animate progress bar
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 50); // small delay to trigger transition

        setTimeout(() => {
            splash.classList.add('hidden'); // fade out
            // Optionally remove from DOM after fade
            setTimeout(() => splash.remove(), 1000);
        }, 1000); // 2000ms = 2s
    });

    const burger = document.getElementById('burgerMenu');
    const nav = document.querySelector('nav.side');

    // Toggle sidebar on burger click
    burger.addEventListener('click', (e) => {
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

    const htmlRoot = document.getElementById('html-root');
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


    // tweak on start
    targetView = { x: 0, y: 0, scale: 1.0 };

})();

