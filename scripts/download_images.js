import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '../public/assets/birds');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const images = [
    { url: "https://upload.wikimedia.org/wikipedia/commons/5/52/Spizaetus_isidori_%28Black-and-chestnut_Eagle%29.jpg", name: "spizaetus_isidori.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Vultur_gryphus_-_01.jpg", name: "vultur_gryphus.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Roadside_Hawk_%28Rupornis_magnirostris%29.jpg", name: "rupornis_magnirostris.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Falco_peregrinus_-Morro_Rock%2C_California%2C_USA_-_adult-8.jpg", name: "falco_peregrinus.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/3/3e/King_Vulture_Sarcoramphus_papa.jpg", name: "sarcoramphus_papa.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/9/93/Harpia_harpyja_001_800.jpg", name: "harpia_harpyja.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/0/05/Swallow-tailed_kite1.jpg", name: "elanoides_forficatus.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/9/91/Crested_Caracara_%28Caracara_cheriway%29.jpg", name: "caracara_cheriway.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/8/87/Herpetotheres_cachinnans_distribution.jpg", name: "herpetotheres_cachinnans.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Pearl_Kite.jpg", name: "gampsonyx_swainsonii.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/7/77/Black-chested_Buzzard-Eagle.jpg", name: "geranoaetus_melanoleucus.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Pandion_haliaetus_-_01.jpg", name: "pandion_haliaetus.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Broad-winged_Hawk_3675.jpg", name: "buteo_platypterus.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/8/82/Yellow-headed_Caracara_%28Milvago_chimachima%29.jpg", name: "milvago_chimachima.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Black-collared_Hawk_%28Busarellus_nigricollis%29_%2827134267665%29.jpg", name: "busarellus_nigricollis.jpg" }
];

const downloadImage = (url, name) => {
    const file = fs.createWriteStream(path.join(outputDir, name));
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${name}`);
        });
    }).on('error', (err) => {
        fs.unlink(name);
        console.error(`Error downloading ${name}: ${err.message}`);
    });
};

images.forEach(img => downloadImage(img.url, img.name));
