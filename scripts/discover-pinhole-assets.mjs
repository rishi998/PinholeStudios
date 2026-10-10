const pages = [
  "https://pinholestudio.in/",
  "https://pinholestudio.in/studios/",
  "https://pinholestudio.in/studios/empty-studio-space/",
  "https://pinholestudio.in/studios/green-screen-studio/",
  "https://pinholestudio.in/studios/the-house-setup/",
  "https://pinholestudio.in/studios/white-cycloroma-setup/",
  "https://pinholestudio.in/studios/podcast-setup/",
  "https://pinholestudio.in/studios/garden-area/",
  "https://pinholestudio.in/studios/lawn-area/",
  "https://pinholestudio.in/work/",
  "https://pinholestudio.in/about-us/",
  "https://pinholestudio.in/services/",
];

const thumb = /-\d+x\d+(?=\.)/;

for (const page of pages) {
  const html = await (await fetch(page)).text();
  const urls = [...html.matchAll(/https?:\/\/pinholestudio\.in\/wp-content\/uploads\/[^"'\\\s>]+\.(?:jpe?g|png|webp|mp4)/gi)].map((match) =>
    match[0].replaceAll("&amp;", "&"),
  );
  const unique = [...new Set(urls)].filter((url) => !thumb.test(url) && !url.includes("/elementor/thumbs/"));
  console.log(`\n## ${page} ${unique.length}`);
  for (const url of unique) console.log(url);
}
