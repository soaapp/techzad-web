import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]


class HomepageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.article_classes = []
        self.h3_text = []
        self.image_sources = []
        self._inside_h3 = False

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == "article":
            self.article_classes.append(attributes.get("class", "").split())
        elif tag == "h3":
            self._inside_h3 = True
        elif tag == "img":
            self.image_sources.append(attributes.get("src", ""))

    def handle_endtag(self, tag):
        if tag == "h3":
            self._inside_h3 = False

    def handle_data(self, data):
        if self._inside_h3 and data.strip():
            self.h3_text.append(data.strip())


class HomepageContractTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT / "index.html").read_text(encoding="utf-8")
        cls.css = (ROOT / "style.css").read_text(encoding="utf-8")
        cls.parser = HomepageParser()
        cls.parser.feed(cls.html)

    def test_six_balanced_capabilities_are_present(self):
        expected = [
            "Product Engineering",
            "AI Systems",
            "Cloud",
            "DevOps & Infrastructure",
            "Project Management",
            "Technical Advisory",
        ]
        capability_articles = [classes for classes in self.parser.article_classes if "capability" in classes]
        self.assertEqual(len(capability_articles), 6)
        self.assertEqual(self.parser.h3_text[:6], expected)

    def test_products_use_dedicated_logos_instead_of_screenshots(self):
        product_articles = [classes for classes in self.parser.article_classes if "product" in classes]
        self.assertEqual(len(product_articles), 2)
        self.assertIn('class="product-grid"', self.html)
        self.assertIn("assets/products/sidekick-logo.png", self.parser.image_sources)
        self.assertIn("assets/products/orden-logo.png", self.parser.image_sources)
        self.assertNotIn("assets/products/sidekick.png", self.parser.image_sources)
        self.assertNotIn("assets/products/orden.png", self.parser.image_sources)

    def test_product_grid_is_two_columns_and_stacks_on_mobile(self):
        self.assertRegex(
            self.css,
            re.compile(r"\.product-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,", re.DOTALL),
        )
        mobile = re.search(r"@media \(max-width: 799px\)\s*\{(?P<body>.*?)(?=\n\})", self.css, re.DOTALL)
        self.assertIsNotNone(mobile)
        self.assertRegex(mobile.group("body"), r"\.product-grid[^}]*grid-template-columns:\s*1fr")

    def test_product_logos_use_equal_dimensions(self):
        self.assertIn('<img src="assets/products/sidekick-logo.png" alt="" width="88" height="88" />', self.html)
        self.assertIn('<img src="assets/products/orden-logo.png" alt="" width="88" height="88" />', self.html)
        self.assertNotIn("orden-wordmark", self.html)

    def test_orden_logo_has_no_light_pixels_on_canvas_edges(self):
        logo = Image.open(ROOT / "assets/products/orden-logo.png").convert("RGB")
        width, height = logo.size
        edge_pixels = (
            [logo.getpixel((x, 0)) for x in range(width)]
            + [logo.getpixel((x, height - 1)) for x in range(width)]
            + [logo.getpixel((0, y)) for y in range(height)]
            + [logo.getpixel((width - 1, y)) for y in range(height)]
        )

        self.assertLess(max(min(pixel) for pixel in edge_pixels), 32)


if __name__ == "__main__":
    unittest.main()
