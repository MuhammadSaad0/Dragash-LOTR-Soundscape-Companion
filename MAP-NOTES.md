# The Westlands atlas

Twelve original SVG illustrations, covering every map used by the 62 audiobook chapters. Open `atlas.html` to browse the whole set, or use the expand symbol above the reader's map. Enlarged maps include Fit and Zoom controls. The reader remains fully local.

## Geographic basis

Rebuilt against these published maps, viewed through Tolkien Gateway:

- [A Part of the Shire, Christopher Tolkien, 1966 printing](https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_A_Part_of_the_Shire.jpg)
- [General Map of Middle-earth, Christopher Tolkien](https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_General_Map_of_Middle-earth.png)
- [Map of Rohan, Gondor, and Mordor, Christopher Tolkien](https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_Map_of_Rohan,_Gondor,_and_Mordor.png)

Additional descriptions consulted: [the Water](https://tolkiengateway.net/wiki/The_Water), [the Old Forest](https://tolkiengateway.net/wiki/Old_Forest), [Withywindle](https://tolkiengateway.net/wiki/Withywindle), [the Last Bridge](https://tolkiengateway.net/wiki/Last_Bridge), [the Ford of Bruinen](https://tolkiengateway.net/wiki/Ford_of_Bruinen), [Lothlórien](https://tolkiengateway.net/wiki/Lothl%C3%B3rien), and [the Grey Havens](https://tolkiengateway.net/wiki/Grey_Havens).

These are interpretive regional journey maps, not exact reproductions or surveyed topography. Relative directions, named rivers, mountain barriers, and settlement relationships follow the references. Each plate uses its own simplified scale. Terrain hatching, individual trees, buildings, and small ground marks are illustrative. Dotted walking routes approximate the narrative; dashed lines denote roads. The Moria crossing represents an underground passage. River travel can coincide with the river line. There is no invented numerical scale bar.

## Corrections in this edition

| Plate | Geographic changes |
| --- | --- |
| Shire | Hobbiton and Bywater north of the East Road; Woody End southeast of Hobbiton; Buckland east of the Brandywine and west of the Old Forest. Added smaller settlements and tributaries. |
| Old Forest | Withywindle joins the Brandywine in the west; Bombadil's house is on the eastern forest edge; the exit runs north through the Downs toward the East Road. |
| Bree-land | Bree northeast of the Greenway / East Road crossing; Chetwood to its northeast; Midgewater between Bree and the Weather Hills. |
| Trollshaws | Hoarwell and the Last Bridge west of the Bruinen; Rivendell northeast of the Ford; mountain barrier to the east. |
| Moria | Eregion west of the mountains, Dimrill Dale and Mirrormere east; the Redhorn approach separated from the underground crossing. |
| Lothlórien | Wood west of the Anduin, Celebrant flowing out of the mountains; Cerin Amroth north of Caras Galadhon. |
| Anduin | Sarn Gebir and the Argonath upstream of Nen Hithoel; Amon Hen west, Amon Lhaw east, Tol Brandir near the southern end, Rauros downstream. |
| Rohan | Isengard north of the Fords; Helm's Deep west of Edoras; Fangorn north of the plains; Entwash draining southeast toward Anduin. |
| Ithilien | Frodo's Emyn Muil approach east of Anduin; the Marshes northwest of the Black Gate; Ithilien west of the mountain wall. |
| Gondor | Minas Tirith west of Anduin, Osgiliath on the river, Ithilien east; Pelargir downstream to the southwest; Dunharrow south of Edoras. |
| Mordor | Cirith Ungol at the western barrier; Udûn in the northwest; Mount Doom west of Barad-dûr; Ered Lithui across the north. |
| Lindon | Westward travel from the Shire through the Tower Hills to Mithlond; the gulf and open sea lie west of the Havens. |

## Playback precision

Playback markers use the same location coordinates as the illustrations, including when enlarged. The Red Book update adds 105 transcript-linked setting/movement milestones across 46 chapters, in journey-tracking.js. Nonzero times are anchored to transcript cues, with the source excerpt in each milestone's tooltip. Maps can change within a chapter, including the Old Forest departure and the westward journey to the Havens. Dialogue about distant places does not by itself move the marker.

The other 16 chapters retain approximate chapter-percentage timing. Nearby events can share a location at regional scale (for example the Houses of Healing and Minas Tirith). Intermediate countryside points are interpretive, not surveyed coordinates. This is milestone tracking, not word-by-word continuous travel or separate tracking of every character. Late appendices/credits in the last audio remain at the final narrative setting.

## Files

- `atlas-maps.js`: authored map data, terrain drawing, shared location coordinates.
- `atlas.css`: map typography and enlarged viewer styling.
- `atlas-viewer.js`: enlarged view and zoom controls.
- `atlas.html`: browse all twelve plates; select one to open its chapter.
- `maps/*.svg`: standalone scalable exports, usable without the audiobook app.

Source maps are referenced, not embedded or downloaded into the application. All map art and lettering render locally without network requests.
