// ============================================================
// SPRITES DE PIXEL ART PROCEDURAIS
// Toda criatura é desenhada em uma grade de 16x16 "unidades".
// Cada unidade vira um bloco sólido (fillRect) — sem imagens
// externas, sem dependências, 100% funcional offline.
// ============================================================
HDP.Sprites = (function () {
    const GRID = 16;

    // Cria uma função "p" que desenha um bloco em unidades de grade,
    // já convertendo para pixels reais e cuidando do espelhamento (flip).
    function painter(ctx, x, y, w, h, flip) {
        const uw = w / GRID, uh = h / GRID;
        return function block(fx, fy, fw, fh, color) {
            const gx = flip ? (GRID - fx - fw) : fx;
            const px = Math.round(x + gx * uw);
            const py = Math.round(y + fy * uh);
            const pw = Math.max(1, Math.round(fw * uw));
            const ph = Math.max(1, Math.round(fh * uh));
            ctx.fillStyle = color;
            ctx.fillRect(px, py, pw, ph);
        };
    }

    function earBlocks(p, earType, body, spot) {
        switch (earType) {
            case 'floppy':
                p(10.6, 1.2, 2.0, 3.2, body);
                p(10.9, 3.6, 1.4, 2.0, spot || body);
                break;
            case 'pointy': p(12, -1, 1, 2, body); p(11, 1, 3, 1, body); break;
            case 'round': p(12, 0, 2, 2, body); break;
            case 'long': p(12, -4, 2, 6, spot || body); p(13.5, -4, 1, 6, body); break;
            default: break;
        }
    }

    function tailBlocks(p, tailType, body, spot, wag) {
        const w = wag ? 1 : 0;
        switch (tailType) {
            case 'straight': p(0, 6 - w, 2, 2, body); break;
            case 'wag': p(0, 4 - w, 2, 3, body); p(0, 3 - w, 1, 1, spot || body); break;
            case 'curly': p(0, 4 - w, 2, 2, body); p(1, 3 - w, 1, 1, body); break;
            case 'puff': p(0, 6, 2, 2, spot || body); break;
            case 'feather': p(0, 6, 3, 3, spot || body); break;
            default: break;
        }
    }

    // Roupinhas/adereços opcionais (vestido, laço, bandana) — desenhados em
    // duas passadas: 'body' (antes da cabeça) e 'head' (depois da cabeça/orelhas)
    function accessoryBlocks(p, accessory, pass) {
        if (!accessory) return;
        const c = accessory.color;
        if (accessory.type === 'dress' && pass === 'body') {
            p(3.5, 9.2, 7, 2.2, c);
            p(2.5, 11.0, 8.5, 2.0, c);
            p(3, 12.7, 7, 0.6, accessory.trim || c);
        } else if (accessory.type === 'bandana' && pass === 'head') {
            p(9, 6, 4, 2, c);
            p(9, 8, 1, 2, c);
        } else if (accessory.type === 'bow' && pass === 'head') {
            p(12.3, 0.8, 1, 1, accessory.knot || '#ffffff');
            p(11.2, 0, 1.3, 1.4, c);
            p(13, 0, 1.3, 1.4, c);
        }
    }

    function drawQuadruped(ctx, x, y, w, h, spec, opts) {
        const { flip, walk, t, hurt } = opts;
        const p = painter(ctx, x, y, w, h, flip);
        const pal = spec.palette;
        const body = hurt ? '#ff5555' : pal.body;
        const spot = hurt ? '#ff8888' : pal.spot;
        const belly = pal.belly || spot;
        const legLift = walk ? (Math.floor(t * 9) % 2) : 0;

        tailBlocks(p, spec.tailType, body, spot, walk && Math.floor(t * 6) % 2 === 0);

        // pernas (atrás do corpo), com pontinha de pata mais clara
        p(3, 12 + (legLift ? 0 : 1) * 0, 2, 3 - legLift, body);
        p(9, 12 + (1 - legLift ? 0 : 1) * 0, 2, 3 - (1 - legLift), body);
        p(2.8, 14.2, 2.4, 0.9, spot);
        p(8.8, 14.2, 2.4, 0.9, spot);

        // corpo, com leve arredondamento nas bordas
        p(3, 6.5, 8, 1, body);
        p(2, 7.5, 10, 4.5, body);
        p(3, 10, 8, 2.2, belly);
        p(4, 12, 6, 0.6, belly);

        accessoryBlocks(p, spec.accessory, 'body');

        // cabeça, arredondada, com focinho projetado pra frente
        p(11.3, 2.6, 3.6, 1, body);
        p(10.6, 3.2, 4.2, 5.6, body);
        p(11.3, 8.4, 3.4, 0.8, body);
        earBlocks(p, spec.earType, body, spot);

        // focinho/focinheira
        p(14.0, 5.6, 1.9, 2.3, body);
        p(15.0, 6.0, 1.0, 1.4, belly);
        p(15.7, 6.3, 0.9, 0.9, '#2a1a12');

        accessoryBlocks(p, spec.accessory, 'head');

        if (spec.eyeStyle === 'asymmetric') {
            // olho visível bem maior e arredondado — traço característico
            p(13.2, 4.2, 2, 2, '#1a1a1a');
            p(13.6, 4.6, 1, 1, '#ffffff');
        } else {
            p(13.0, 4.3, 1.6, 1.6, '#1a1a1a');
            p(13.3, 4.5, 0.6, 0.6, '#ffffff');
        }
    }

    function drawBiped(ctx, x, y, w, h, spec, opts) {
        const { flip, walk, t, hurt } = opts;
        const p = painter(ctx, x, y, w, h, flip);
        const pal = spec.palette;
        const skin = hurt ? '#ff8888' : pal.body;
        const clothes = pal.clothes;
        const hair = pal.hair;
        const legLift = walk ? (Math.floor(t * 9) % 2) : 0;

        p(6, 12 + legLift, 2, 4 - legLift, clothes);
        p(9, 12 + (1 - legLift), 2, 4 - (1 - legLift), clothes);
        p(6, 15, 2, 1, '#3a2a1a');
        p(9, 15, 2, 1, '#3a2a1a');

        p(5, 7, 7, 5, clothes);
        p(4, 7, 1, 4, skin);
        p(12, 7, 1, 4, skin);

        p(6, 1, 5, 6, skin);
        p(6, 0, 5, 3, hair);
        p(5, 1, 1, 3, hair);
        p(11, 1, 1, 3, hair);
        p(9, 4, 1, 1, '#1a1a1a');
    }

    function drawBlob(ctx, x, y, w, h, spec, opts) {
        const { t, hurt } = opts;
        const p = painter(ctx, x, y, w, h, false);
        const bounce = Math.sin(t * 6) * 0.6;
        const body = hurt ? '#ff5555' : spec.palette.body;
        const spot = hurt ? '#ff8888' : spec.palette.spot;
        p(4, 12 + bounce, 8, 3, body);
        p(3, 9 + bounce, 10, 3, body);
        p(4, 6 + bounce, 8, 3, body);
        p(6, 4 + bounce, 4, 3, body);
        p(6, 5 + bounce, 2, 1, spot);
        p(6, 9 + bounce, 1, 1, '#1a1a1a');
        p(9, 9 + bounce, 1, 1, '#1a1a1a');
    }

    function drawFlyer(ctx, x, y, w, h, spec, opts) {
        const { flip, t, hurt } = opts;
        const p = painter(ctx, x, y, w, h, flip);
        const body = hurt ? '#ff5555' : spec.palette.body;
        const spot = hurt ? '#ff8888' : spec.palette.spot;
        const up = Math.floor(t * 8) % 2 === 0;

        p(5, 10, 3, 2, spot);
        p(6, 6, 4, 5, body);
        p(9, 5, 3, 3, body);
        p(11, 6, 1, 1, '#1a1a1a');

        if (up) {
            p(1, 4, 5, 2, spot);
            p(9, 4, 5, 2, spot);
        } else {
            p(2, 8, 4, 2, spot);
            p(9, 8, 4, 2, spot);
        }
    }

    function drawCrawler(ctx, x, y, w, h, spec, opts) {
        const { t, hurt } = opts;
        const p = painter(ctx, x, y, w, h, false);
        const body = hurt ? '#ff5555' : spec.palette.body;
        const spot = hurt ? '#ff8888' : spec.palette.spot;
        const shift = Math.floor(t * 10) % 2;

        p(0, 9, 3, 2, spot);
        p(13, 9, 3, 2, spot);
        p(3, 8, 10, 5, body);
        p(5, 7, 6, 2, spot);
        p(5, 6, 1, 1, '#1a1a1a');
        p(10, 6, 1, 1, '#1a1a1a');
        p(2, 12 + shift, 2, 1, body);
        p(1, 10 - shift, 2, 1, body);
        p(12, 12 - shift, 2, 1, body);
        p(13, 10 + shift, 2, 1, body);
    }

    function drawSerpent(ctx, x, y, w, h, spec, opts) {
        const { flip, t, hurt } = opts;
        const p = painter(ctx, x, y, w, h, flip);
        const body = hurt ? '#ff5555' : spec.palette.body;
        const spot = hurt ? '#ff8888' : spec.palette.spot;
        for (let i = 0; i < 5; i++) {
            const wave = Math.sin(t * 6 + i * 1.2) * 1.3;
            p(0.5 + i * 2.6, 8 + wave, 3, 3, i % 2 === 0 ? body : spot);
        }
        p(13, 6.5, 3, 4, body);
        p(15, 7.5, 1, 1, '#1a1a1a');
    }

    const KIND_DRAW = {
        quadruped: drawQuadruped,
        biped: drawBiped,
        blob: drawBlob,
        flyer: drawFlyer,
        crawler: drawCrawler,
        serpent: drawSerpent
    };

    function draw(ctx, spec, x, y, w, h, opts) {
        opts = opts || {};
        const fn = KIND_DRAW[spec.kind] || drawQuadruped;
        ctx.imageSmoothingEnabled = false;
        // Corpos de quadro pés/rastejantes/voadores usam uma grade quase
        // quadrada; se a caixa de colisão for mais alta que larga (ex.: o
        // jogador), desenha a criatura compacta e alinhada ao chão da caixa
        // em vez de esticá-la verticalmente.
        let dw = w, dh = h, dy = y;
        if (spec.kind !== 'biped') {
            dh = Math.min(h, w * 1.05);
            dy = y + (h - dh);
        }
        fn(ctx, x, dy, dw, dh, spec, {
            flip: opts.facing === -1,
            walk: !!opts.walking,
            t: opts.t || 0,
            hurt: !!opts.hurt
        });
    }

    function drawCage(ctx, x, y, w, h) {
        const p = painter(ctx, x, y, w, h, false);
        p(1, 1, 14, 13, 'rgba(60,45,30,0.25)');
        for (let i = 0; i < 5; i++) {
            p(1 + i * 3, 1, 1, 13, '#8a6a45');
        }
        p(1, 1, 14, 1, '#8a6a45');
        p(1, 13, 14, 1, '#8a6a45');
        p(6, 6, 4, 4, '#ffd54a');
    }

    function drawItem(ctx, kind, x, y, w, h, t) {
        const p = painter(ctx, x, y, w, h, false);
        const bob = Math.sin((t || 0) * 4) * 0.8;
        if (kind === 'bone') {
            p(2, 6 + bob, 3, 4, '#f5f0e6');
            p(11, 6 + bob, 3, 4, '#f5f0e6');
            p(4, 7 + bob, 8, 2, '#f5f0e6');
        } else if (kind === 'coin') {
            p(4, 3 + bob, 8, 10, '#ffd700');
            p(5, 4 + bob, 6, 8, '#ffb300');
            p(6, 6 + bob, 2, 4, '#ffe27a');
        } else if (kind === 'heart') {
            p(3, 4 + bob, 4, 3, '#ff4d6d');
            p(9, 4 + bob, 4, 3, '#ff4d6d');
            p(2, 6 + bob, 12, 3, '#ff4d6d');
            p(3, 9 + bob, 10, 2, '#ff4d6d');
            p(5, 11 + bob, 6, 2, '#ff4d6d');
            p(7, 13 + bob, 2, 1, '#ff4d6d');
        } else if (kind === 'gem') {
            p(6, 2 + bob, 4, 2, '#4fc3f7');
            p(4, 4 + bob, 8, 3, '#29b6f6');
            p(5, 7 + bob, 6, 3, '#0288d1');
            p(7, 10 + bob, 2, 2, '#01579b');
        }
    }

    function drawFlag(ctx, x, y, w, h, t, waving) {
        const p = painter(ctx, x, y, w, h, false);
        p(1, 0, 1, 16, '#8a6a45');
        const wave = waving ? Math.sin((t || 0) * 5) * 1 : 0;
        const color = waving ? '#4caf50' : '#ffb300';
        p(2, 1 + wave * 0.3, 8, 2, color);
        p(2, 3 + wave * 0.5, 9, 2, color);
        p(2, 5 + wave * 0.3, 7, 2, color);
    }

    return { draw, drawCage, drawItem, drawFlag, GRID };
})();
