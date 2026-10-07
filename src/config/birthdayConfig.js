export const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || './';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${cleanPath}`;
};

export const birthdayConfig = {
  // Easy customization fields for the user
  name: "Ram",
  title: "HAPPY BIRTHDAY",
  tagline: "To the most magical person in the world ✨",
  
  // Message shown on the Memory Scrapbook page
  message: "Thank you for coming into my life and making it so much more beautiful.",
  
  // Final wish revealed after blowing out the anti-gravity cake candles
  wishMessage: "May every little wish you make find its way to you. ✨",
  
  // Birthday Video config: uploaded birthday video
  birthdayVideoUrl: getAssetUrl("birthday.mp4"),

  // Bunny Loading Video URL
  bunnyVideoUrl: getAssetUrl("bunny.mp4"),

  // Cake Asset URL
  cakeAssetUrl: getAssetUrl("cake.png"),

  // Audio config: Set to tere bina.mp3 (also supports URL encoding)
  musicUrl: getAssetUrl("tere_bina.mp3"),

  // Photo Memory Scrapbook items: Actual 7 uploaded photos (1, 2, 3, 4, 5, 6, 7)
  photos: [
    {
      id: "1",
      url: getAssetUrl("1.jpg"),
      caption: "Golden hour laughter 🌅",
      rotation: -3,
      tapeColor: "#E8C5C8"
    },
    {
      id: "2",
      url: getAssetUrl("2.jpg"),
      caption: "Precious moments ✨",
      rotation: 3,
      tapeColor: "#DFB86C"
    },
    {
      id: "3",
      url: getAssetUrl("3.jpg"),
      caption: "Unforgettable smiles 🎈",
      rotation: -4,
      tapeColor: "#B3A9D9"
    },
    {
      id: "4",
      url: getAssetUrl("4.jpg"),
      caption: "Together always 🌟",
      rotation: 5,
      tapeColor: "#FCEBE1"
    },
    {
      id: "5",
      url: getAssetUrl("5.jpg"),
      caption: "Treasured memories 💕",
      rotation: -2,
      tapeColor: "#E3EDF7"
    },
    {
      id: "6",
      url: getAssetUrl("6.jpg"),
      caption: "Joyful times 🥂",
      rotation: 4,
      tapeColor: "#E8A5B8"
    },
    {
      id: "7",
      url: getAssetUrl("7.jpg"),
      caption: "Always us 💗",
      rotation: -3,
      tapeColor: "#DFB86C"
    }
  ]
};
