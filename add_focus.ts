import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

function addFocusToTag(tag: string) {
  const regex = new RegExp(`<${tag}\\b([^>]*)className="([^"]*)"`, 'g');
  content = content.replace(regex, (match, p1, p2) => {
    if (p2.includes('focus-visible:ring-2')) return match;
    return `<${tag}${p1}className="focus-visible:ring-2 focus-visible:ring-[#C67A3D] focus-visible:ring-offset-2 focus:outline-none ${p2}"`;
  });
}

['button', 'input', 'textarea', 'select', 'a'].forEach(addFocusToTag);

// Add aria-labels to icon buttons
const iconButtons = [
  { search: `<Menu className="w-5 h-5" />`, label: "Open menu" },
  { search: `<Sun className="w-5 h-5" />`, label: "Switch to Light Mode" },
  { search: `<Moon className="w-5 h-5" />`, label: "Switch to Dark Mode" },
  { search: `<ShoppingBag className="w-5 h-5" />`, label: "Open cart" },
  { search: `<UserIcon className="w-5 h-5" />`, label: "User profile" },
  { search: `<Heart className="w-5 h-5" />`, label: "Wishlist" },
  { search: `<X className="w-5 h-5" />`, label: "Close" },
  { search: `<X className="w-6 h-6" />`, label: "Close" },
  { search: `<ChevronLeft className="w-4 h-4" />`, label: "Previous" },
  { search: `<ChevronRight className="w-4 h-4" />`, label: "Next" },
  { search: `<ChevronLeft className="w-5 h-5" />`, label: "Previous" },
  { search: `<ChevronRight className="w-5 h-5" />`, label: "Next" },
];

iconButtons.forEach(({ search, label }) => {
  const regex = new RegExp(`(<button[^>]*?)>`, 'g');
  content = content.replace(regex, (match, p1) => {
    // We only want to add aria-label if the button contains the icon.
    // Since regex replace is line-by-line or match-by-match, it's hard to look ahead.
    return match;
  });
});

// A better way to add aria-labels is to find the button and check its contents, but regex is tricky.
// Let's just do it manually for the most important ones using replace.

content = content.replace(
  /<button([^>]*)>\s*<Menu className="w-5 h-5" \/>\s*<\/button>/g,
  `<button$1 aria-label="Open mobile menu">\n            <Menu className="w-5 h-5" />\n          </button>`
);

content = content.replace(
  /<button([^>]*)>\s*<X className="w-6 h-6" \/>\s*<\/button>/g,
  `<button$1 aria-label="Close menu">\n                <X className="w-6 h-6" />\n              </button>`
);

content = content.replace(
  /<button([^>]*)>\s*<X className="w-5 h-5" \/>\s*<\/button>/g,
  `<button$1 aria-label="Close">\n                <X className="w-5 h-5" />\n              </button>`
);

content = content.replace(
  /<button([^>]*)>\s*<ChevronLeft className="w-4 h-4" \/>\s*<\/button>/g,
  `<button$1 aria-label="Previous image">\n              <ChevronLeft className="w-4 h-4" />\n            </button>`
);

content = content.replace(
  /<button([^>]*)>\s*<ChevronRight className="w-4 h-4" \/>\s*<\/button>/g,
  `<button$1 aria-label="Next image">\n              <ChevronRight className="w-4 h-4" />\n            </button>`
);

content = content.replace(
  /<button([^>]*)>\s*<ChevronLeft className="w-5 h-5" \/>\s*<\/button>/g,
  `<button$1 aria-label="Previous image">\n                        <ChevronLeft className="w-5 h-5" />\n                      </button>`
);

content = content.replace(
  /<button([^>]*)>\s*<ChevronRight className="w-5 h-5" \/>\s*<\/button>/g,
  `<button$1 aria-label="Next image">\n                        <ChevronRight className="w-5 h-5" />\n                      </button>`
);

fs.writeFileSync('src/App.tsx', content);
