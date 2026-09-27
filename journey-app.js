(function () {
  "use strict";

  var audio = document.getElementById("audio");
  var map = document.getElementById("map");
  var shireMap = document.querySelector(".cartography-map");
  var regionalMap = document.getElementById("regional-map");
  var party = document.getElementById("party");
  var bookEyebrow = document.getElementById("book-eyebrow");
  var bookTitle = document.getElementById("book-title");
  var chapterLabel = document.getElementById("chapter-label");
  var pageMeta = document.getElementById("page-meta");
  var pageCount = document.getElementById("page-count");
  var mapPanelTitle = document.getElementById("map-panel-title");
  var mapPanelKicker = document.getElementById("map-panel-kicker");
  var sceneTitle = document.getElementById("scene-title");
  var sceneLocation = document.getElementById("scene-location");
  var sceneDescription = document.getElementById("scene-description");
  var sceneProgress = document.getElementById("scene-progress");
  var mapLocation = document.getElementById("map-location");
  var mapSubtitle = document.getElementById("map-subtitle");
  var sceneList = document.getElementById("scenes");
  var cueList = document.getElementById("transcript-cues");
  var cueStatus = document.getElementById("cue-status");
  var notice = document.getElementById("notice");
  var audioName = document.getElementById("audio-name");
  var chapters = window.POC_CHAPTERS || [];
  var cues = [];
  var scenes = [];
  var currentChapterIndex = 0;
  var currentChapter = null;
  var currentMeta = null;
  var currentCue = -1;
  var paintedCue = null;
  var manualScrollUntil = 0;
  cueList.addEventListener('wheel', function () { manualScrollUntil = Date.now() + 8000; }, { passive: true });
  cueList.addEventListener('touchmove', function () { manualScrollUntil = Date.now() + 8000; }, { passive: true });
  var currentSceneId = "";
  var pendingSeek = null;
  var chapterLoading = false;
  var turnLocked = false;
  var lastSavedAt = 0;
  var bookmarks = window.POC_BOOKMARK;

  function savePlace(force) {
    if (!bookmarks || !currentChapter || chapterLoading || pendingSeek !== null || audio.dataset.chapter !== currentChapter.id) return;
    if (!force && Date.now() - lastSavedAt < 1500) return;
    bookmarks.save(currentChapter.id, currentChapterIndex, Number(audio.currentTime) || 0, audio);
    lastSavedAt = Date.now();
  }
  var selectedAudio = {};
  var selectedAudioUrls = [];

  function beat(ratio, title, location, mapKey, mapTitle, subtitle, desc) {
    return { ratio: ratio, title: title, location: location, map: mapKey, mapTitle: mapTitle, subtitle: subtitle, desc: desc };
  }

  function page(region, pageMetaText, beats) {
    return { region: region, pageMeta: pageMetaText, beats: beats };
  }

  var chapterMeta = [
    page("shire", "The Shire · September 22", [
      beat(0, "A quiet beginning", "Bag End · the Hill", "bag-end", "Bag End", "The Hill · Hobbiton", "The Shire is already talking about Bilbo’s remarkable birthday party."),
      beat(.52, "The party field", "Hobbiton · the party field", "party-field", "Party Field", "Lights across the Green", "Food, music, lanterns, and a whole Shire full of guests gather under the evening sky."),
      beat(.82, "Into the twilight", "The East Road", "east-road", "East Road", "The first step of the journey", "The wizard’s figure fades into the evening. The road has begun.")
    ]),
    page("shire", "The Shire · Bag End", [
      beat(0, "The talk goes on", "Hobbiton · Bag End", "bag-end", "Bag End", "The Hill · Hobbiton", "Bilbo’s disappearance grows into a fireside legend."),
      beat(.52, "A shadow from the past", "Bag End · the study", "bag-end", "Bag End", "A secret passed on", "Gandalf returns to ask the questions Frodo has been avoiding."),
      beat(.84, "Keep it secret", "Bag End · the Hill", "bag-end", "Bag End", "The Ring stays in the Shire", "A quiet conversation turns the familiar hill into the first threshold of the quest.")
    ]),
    page("shire", "The Shire · the East Road", [
      beat(0, "The road out", "Hobbiton · the Hill", "hobbiton", "Hobbiton", "The road east", "Frodo leaves the Shire by a path that still feels close to home."),
      beat(.47, "Woody End", "Woody End", "woody-end", "Woody End", "The trees close around the road", "The East Road narrows beneath the trees and the world beyond the Shire comes nearer."),
      beat(.82, "The Elves", "The eastward road", "east-road", "East Road", "A first glimpse beyond", "Gildor’s company offers help, song, and a warning about the Riders.")
    ]),
    page("shire", "Buckland · the Marish", [
      beat(0, "A short cut", "Buckland · Crickhollow", "crickhollow", "Crickhollow", "Across the Brandywine", "The route leaves the road and cuts through the eastern edge of the Shire."),
      beat(.5, "Farmer Maggot’s farm", "The Marish", "maggots-farm", "Farmer Maggot’s Farm", "The fields of the Marish", "An unexpected ride through the fields becomes one of the safest parts of the night."),
      beat(.82, "Bucklebury Ferry", "Buckland · the Ferry", "bucklebury-ferry", "Bucklebury Ferry", "The river behind them", "The Brandywine becomes a boundary: once crossed, the old life is left behind.")
    ]),
    page("shire", "Buckland · the Old Forest gate", [
      beat(0, "Crickhollow", "Buckland · Frodo’s new house", "crickhollow", "Crickhollow", "A house prepared for a departure", "Merry and Pippin reveal that Frodo’s secret has not been kept as closely as he hoped."),
      beat(.5, "The conspiracy", "Buckland · the Hedge", "old-forest-gate", "Buckland Hedge", "The hidden tunnel east", "The friends decide to leave together through the Hedge."),
      beat(.83, "Outside the Shire", "The Old Forest · western edge", "old-forest-gate", "Old Forest Gate", "The trees do not welcome them", "Fatty stays behind as the four Hobbits pass through the gate.")
    ]),
    page("old-forest", "East of Buckland · September 26", [
      beat(0, "The Old Forest", "The Old Forest · the Hedge", "forest-gate", "The Old Forest", "The trees bend the road", "The path seems straight until the wood begins turning the company south."),
      beat(.48, "Old Man Willow", "Withywindle valley", "old-willow", "Old Man Willow", "The river at the heart of the wood", "The forest draws the Hobbits toward the Withywindle and the sleeping willow."),
      beat(.82, "Tom Bombadil", "The Withywindle", "tom-house", "Tom Bombadil’s House", "A song on the riverbank", "Tom arrives with lilies and song, then leads the company toward his house.")
    ]),
    page("old-forest", "Tom Bombadil’s country", [
      beat(0, "The house under hill", "Tom Bombadil’s House", "tom-house", "Tom Bombadil’s House", "Goldberry by the Withywindle", "For two nights the Hobbits rest in Tom and Goldberry’s strange country."),
      beat(.54, "The river-daughter", "The Withywindle", "withywindle", "The Withywindle", "Water-lilies and old songs", "Tom’s country is measured by the river, its songs, and its old dangers."),
      beat(.84, "East toward the Downs", "The Old Forest · eastern edge", "barrow-downs", "Barrow-downs", "The road beyond Tom’s country", "Tom warns the travellers about the bare hills beyond the forest and the road to Bree.")
    ]),
    page("old-forest", "The Barrow-downs · September 28", [
      beat(0, "The fog", "The Barrow-downs", "barrow-downs", "Barrow-downs", "Treeless hills east of the wood", "The company climbs among ancient mounds beneath a thickening fog."),
      beat(.52, "The barrow", "The Barrow-downs · the mound", "barrow-downs", "The Barrow", "A cold chamber beneath the hill", "The Hobbits are drawn into a barrow by the wight within."),
      beat(.86, "The East Road", "The road to Bree", "east-road", "East Road", "Bree ahead in the dark", "Freed by Tom’s song, the travellers find the road and see the lights of Bree.")
    ]),
    page("bree-weather", "Bree-land · September 29", [
      beat(0, "The Prancing Pony", "Bree · the West-gate", "bree", "Bree", "The Prancing Pony", "Bree is the first place where Men and Hobbits share the same road and inn."),
      beat(.5, "The common room", "Bree · the Prancing Pony", "prancing-pony", "The Prancing Pony", "Strangers on the East Road", "The inn gathers travellers, rumours, and one dark figure watching from the corner."),
      beat(.84, "A name in the dark", "Bree · the inn", "bree", "Bree", "The Ranger called Strider", "The road east now has a guide, and the Hobbits learn how close the Riders may be.")
    ]),
    page("bree-weather", "The East Road · Bree to Weathertop", [
      beat(0, "Strider", "Bree · the East Road", "bree", "Bree", "The road east", "Strider leads the Hobbits away from Bree and toward the Weather Hills."),
      beat(.52, "The road bends", "The East Road · Lone-lands", "east-road", "The East Road", "The Forsaken Inn behind them", "The settled country thins out and the old road becomes the Fellowship’s thread east."),
      beat(.86, "Weathertop ahead", "The Weather Hills", "weathertop", "Weathertop", "Amon Sûl above the road", "The southern peak of the Weather Hills rises alone above the broken country.")
    ]),
    page("bree-weather", "The Weather Hills · October 6", [
      beat(0, "The hilltop", "Weathertop · Amon Sûl", "weathertop", "Weathertop", "The ruined tower", "The message from Gandalf is found, but the hilltop is no longer safe."),
      beat(.5, "The camp", "Weathertop · the dell", "weathertop", "Weathertop", "A fire beneath the summit", "The company shelters below the summit while the Riders gather in the dark."),
      beat(.83, "The wound", "Weathertop · the dell", "weathertop", "Weathertop", "The Morgul-knife", "Frodo is struck, and the road east becomes a race against the wound’s shadow.")
    ]),
    page("trollshaws", "The Last Bridge · the Trollshaws", [
      beat(0, "The Last Bridge", "The Hoarwell · Last Bridge", "last-bridge", "Last Bridge", "The East Road over the Hoarwell", "The company crosses the ancient bridge and enters the Trollshaws."),
      beat(.52, "The Trollshaws", "The Trollshaws", "trollshaws", "The Trollshaws", "The road bends through wooded hills", "The East Road passes through country that hides every approach."),
      beat(.86, "The Ford", "Bruinen · the Ford of Rivendell", "ford-bruinen", "Ford of Bruinen", "The river under Elrond’s power", "Glorfindel brings Frodo to the Ford while the Riders close behind.")
    ]),
    page("trollshaws", "Rivendell · the Last Homely House", [
      beat(0, "The hidden valley", "Rivendell · the Bruinen", "rivendell", "Rivendell", "The valley of Imladris", "The road drops into the hidden valley beside the loud-flowing Bruinen."),
      beat(.5, "The Last Homely House", "Rivendell · the terraces", "rivendell", "Rivendell", "A refuge in the foothills", "The company is healed and welcomed beneath the pines and oaks of Elrond’s house."),
      beat(.84, "The council", "Rivendell · the hall", "council", "Rivendell", "The road turns south and east", "The next road will cross the mountains and carry the Ring onward.")
    ]),
    page("trollshaws", "Rivendell · the Council Ring", [
      beat(0, "The Council", "Rivendell · the council ring", "council", "Rivendell", "A decision beneath the mountains", "The history of the Ring is gathered into one room and one impossible choice."),
      beat(.52, "The Fellowship", "Rivendell · the valley", "rivendell", "Rivendell", "Nine walkers for the road", "The company is formed and the next journey is laid open."),
      beat(.84, "The Redhorn route", "Rivendell · the East Road", "rivendell", "Rivendell", "South toward Hollin", "The Fellowship leaves the Last Homely House toward the Misty Mountains.")
    ]),
    page("moria", "Eregion · the Redhorn Pass", [
      beat(0, "The Ring goes South", "Rivendell · the East Road", "rivendell", "Rivendell", "The Fellowship takes the road", "The company leaves Imladris and crosses the empty country toward Hollin."),
      beat(.5, "Hollin", "Eregion · the old Elven land", "hollin", "Hollin", "The Doors of Durin ahead", "The land opens beneath the Misty Mountains, marked by the ruins of Eregion."),
      beat(.84, "The Redhorn Pass", "The Misty Mountains · Caradhras", "redhorn-pass", "Redhorn Pass", "The mountain turns them back", "Snow and stone close the high pass, leaving the Doors of Durin as the road ahead.")
    ]),
    page("moria", "Moria · the West-gate", [
      beat(0, "The Doors of Durin", "Moria · the West-gate", "doors-of-durin", "Doors of Durin", "The dark door in the cliff", "The Fellowship reaches the lake and the Elven door built into the mountain."),
      beat(.5, "Khazad-dûm", "Moria · the halls", "moria", "Moria", "The city beneath the mountains", "The route disappears into stairs, passages, and the long darkness of the Dwarves’ city."),
      beat(.86, "The deep places", "Moria · the lower halls", "moria", "Moria", "Something wakes below", "The road east leads deeper than the company intended.")
    ]),
    page("moria", "Moria · the Dimrill Dale", [
      beat(0, "The Bridge", "Moria · the Bridge of Khazad-dûm", "bridge-khazad-dum", "Bridge of Khazad-dûm", "The chasm beneath the city", "The company reaches the bridge where the dark beneath Moria catches up with them."),
      beat(.55, "The East-gate", "Moria · the East-gate", "dimrill-dale", "Dimrill Dale", "The first light after the dark", "The Fellowship escapes into the valley below the Misty Mountains."),
      beat(.86, "Mirrormere", "Dimrill Dale · Mirrormere", "dimrill-dale", "Dimrill Dale", "The silver rills", "The mountains open into the Dimrill Dale, and the road turns toward Lothlórien.")
    ]),
    page("lothlorien", "Lothlórien · the Golden Wood", [
      beat(0, "The Golden Wood", "Dimrill Dale · the western border", "dimrill-dale", "Dimrill Dale", "The road down from Moria", "The Fellowship descends from the mountain valley toward the trees of Lothlórien."),
      beat(.5, "Nimrodel", "Lothlórien · Nimrodel", "nimrodel", "Nimrodel", "The clear stream from the mountains", "The company pauses beside the stream whose name belongs to an Elf-maid and to the water."),
      beat(.84, "Caras Galadhon", "Lothlórien · Caras Galadhon", "caras-galadhon", "Caras Galadhon", "The city beneath the mallorn trees", "The Galadhrim lead the Fellowship into the heart of the Golden Wood.")
    ]),
    page("lothlorien", "Lothlórien · Caras Galadhon", [
      beat(0, "The city of the trees", "Caras Galadhon · the hill", "caras-galadhon", "Caras Galadhon", "The hill of the mallorn", "The Fellowship climbs into the city and learns that Gandalf has fallen in Moria."),
      beat(.5, "The Mirror", "Caras Galadhon · the garden", "mirror", "The Mirror of Galadriel", "A basin of possible things", "Galadriel shows Frodo a mirror that reflects the past, the present, and what might come."),
      beat(.84, "The gifts", "Caras Galadhon · the river stairs", "caras-galadhon", "Caras Galadhon", "A boat for the Great River", "The company is equipped for the next stage down Anduin.")
    ]),
    page("lothlorien", "Lothlórien · the Anduin", [
      beat(0, "Farewell to Lórien", "Caras Galadhon · the south road", "caras-galadhon", "Caras Galadhon", "The Golden Wood behind them", "The Fellowship leaves the city and follows the river road to the boats."),
      beat(.5, "The Silverlode", "Lothlórien · the river landing", "boat-landing", "The Boat-landing", "Where the forest meets Anduin", "The Silverlode and the forest open onto the Great River."),
      beat(.84, "The Great River", "Anduin · north of Lórien", "anduin", "The Great River", "The current carries them south", "The boats push away from the bank and the journey becomes a river journey.")
    ]),
    page("anduin", "Anduin · Sarn Gebir to Nen Hithoel", [
      beat(0, "The Great River", "Anduin · the northern reaches", "anduin", "The Great River", "Between the mountains and the woods", "The Fellowship follows Anduin south, keeping the western bank whenever possible."),
      beat(.5, "The Argonath", "Anduin · the Pillars of the Kings", "argonath", "The Argonath", "The ancient gate of Gondor", "The river narrows beneath two enormous figures carved into the cliffs."),
      beat(.84, "Nen Hithoel", "Anduin · the long lake", "nen-hithoel", "Nen Hithoel", "The lake above Rauros", "The pent waters widen into the long lake, ringed by the bare hills of Emyn Muil.")
    ]),
    page("anduin", "Nen Hithoel · February 25", [
      beat(0, "Parth Galen", "Nen Hithoel · the western lawn", "parth-galen", "Parth Galen", "At the foot of Amon Hen", "The Fellowship lands at the green lawn beside the lake and prepares for the next choice."),
      beat(.52, "Amon Hen", "Amon Hen · the Seat of Seeing", "amon-hen", "Amon Hen", "The Hill of Seeing", "Frodo climbs above the lake and looks farther than any Hobbit should be able to see."),
      beat(.84, "The Breaking", "Nen Hithoel · Rauros", "rauros", "Rauros", "The Fellowship comes apart", "The lake, the falls, and the three hills become the last shared page of Part One.")
    ])
  ];

  chapterMeta = chapterMeta.concat([
    page("rohan", "Parth Galen · February 26", [
      beat(0, "The boats", "Parth Galen · the river shore", "parth-galen", "Parth Galen", "The last shared shore", "The Fellowship is broken, and the boats wait below Amon Hen."),
      beat(.46, "The seat of seeing", "Amon Hen · the hill", "amon-hen", "Amon Hen", "A view of the eastern road", "Aragorn searches the hill while the sound of pursuit carries across the Emyn Muil."),
      beat(.82, "Eastward", "The eastern edge of Emyn Muil", "emyn-muil", "Emyn Muil", "Frodo and Sam take the long way", "Two small figures leave the river and begin the hard descent into the hills.")
    ]),
    page("rohan", "The Emyn Muil · Eastemnet", [
      beat(0, "The long chase", "The Emyn Muil · the west wall", "emyn-muil", "Emyn Muil", "Bare hills above the river", "Aragorn, Legolas, and Gimli follow the Orc-trail across the eastern marches."),
      beat(.5, "The Riders", "Eastemnet · the open grass", "eastemnet", "Eastemnet", "The horsemen of Rohan", "The green plain opens beneath the hills and the Riders appear on the horizon."),
      beat(.84, "The eaves of Fangorn", "Fangorn · the northern edge", "fangorn", "Fangorn", "The forest at the end of the trail", "The hunt reaches the ancient trees where the trail disappears among roots and shadow.")
    ]),
    page("rohan", "Fangorn · the edge of Rohan", [
      beat(0, "The captives", "Fangorn · the forest edge", "fangorn", "Fangorn", "The Orc-band breaks apart", "Merry and Pippin are carried toward the forest while the Riders close the distance."),
      beat(.5, "The open plain", "Eastemnet · the Riddermark", "eastemnet", "Eastemnet", "A country made for horses", "The Rohirrim ride back across the grasslands, leaving the enemy behind them."),
      beat(.84, "Into the trees", "Fangorn · the eaves", "fangorn", "Fangorn", "The forest keeps its own counsel", "The trail turns beneath the boughs, and the oldest shepherds of Middle-earth begin to wake.")
    ]),
    page("rohan", "Fangorn · the Entmoot", [
      beat(0, "Treebeard", "Fangorn · the forest paths", "fangorn", "Fangorn", "A slow country of roots", "Merry and Pippin meet the shepherd of the trees and learn that Fangorn remembers."),
      beat(.5, "Wellinghall", "Fangorn · Wellinghall", "wellinghall", "Wellinghall", "The Ent-house", "The Ents gather, speak, and weigh the long danger coming from Isengard."),
      beat(.84, "The march", "The road to Isengard", "isengard", "Isengard", "The ring of stone ahead", "The Entmoot turns west, and the tree-herds begin their march toward Saruman’s fortress.")
    ]),
    page("rohan", "Fangorn · the White Rider", [
      beat(0, "The forest opens", "Fangorn · the forest floor", "fangorn", "Fangorn", "A light among the branches", "Aragorn and his companions enter the wood where the old trail has gone cold."),
      beat(.5, "The White Rider", "Fangorn · the high glade", "wellinghall", "Fangorn", "A voice they know", "A white figure steps out of the mist and the road changes its meaning."),
      beat(.84, "South to Rohan", "Eastemnet · the grasslands", "eastemnet", "Eastemnet", "The king’s country", "The company leaves the trees and rides toward Edoras and the Golden Hall.")
    ]),
    page("rohan", "Rohan · Edoras", [
      beat(0, "The ride east", "Eastemnet · the road to Edoras", "eastemnet", "Eastemnet", "The Snowbourn ahead", "The green plains lead the company south toward the hill of the Rohirrim."),
      beat(.5, "The Golden Hall", "Edoras · the hill of Meduseld", "edoras", "Edoras", "The hall above the roofs", "The riders climb the hill where Théoden’s hall watches over the valley."),
      beat(.84, "The king’s choice", "Edoras · Meduseld", "meduseld", "Meduseld", "The doors of the Golden Hall", "The king is roused, and the road turns toward the Westfold and war.")
    ]),
    page("rohan", "The Westfold · Helm’s Deep", [
      beat(0, "The muster", "Edoras · the road west", "edoras", "Edoras", "Riders on the Westfold road", "The people of Rohan leave the hill and take the long road toward the fortress."),
      beat(.5, "The Deeping-coomb", "The Westfold · the valley", "westfold", "Westfold", "The White Mountains close in", "The road narrows beneath the mountains as the host makes for Helm’s Deep."),
      beat(.84, "The Hornburg", "Helm’s Deep · the Deeping Wall", "helm-deep", "Helm’s Deep", "The fortress below Thrihyrne", "The Deeping Wall and the Hornburg become the last shelter before the night attack.")
    ]),
    page("rohan", "The Road to Isengard", [
      beat(0, "The valley road", "Helm’s Deep · the Westfold", "westfold", "Westfold", "The road north", "The host rides from the Hornburg toward the Fords of Isen and Saruman’s country."),
      beat(.5, "The Fords of Isen", "The Isen · the northern road", "fords-isen", "Fords of Isen", "Water between the armies", "The road follows the river north as the mountains fall away behind them."),
      beat(.84, "The Ring of Isengard", "Isengard · the outer wall", "isengard", "Isengard", "Orthanc inside the stone", "The road enters the circle of rock where Saruman’s works have stripped the valley bare.")
    ]),
    page("rohan", "Isengard · after the Ents", [
      beat(0, "The flooded plain", "Isengard · the Ring-wall", "isengard", "Isengard", "Water in the fortress", "The Ring of Isengard lies broken and the plain is full of pools, mud, and fallen works."),
      beat(.5, "Flotsam", "Isengard · the drowned pits", "isengard", "Isengard", "Saruman’s ruin", "Merry and Pippin tell the story of the Ents while the company searches the wreckage."),
      beat(.84, "The tower", "Isengard · Orthanc", "orthanc", "Orthanc", "A black needle in the ring", "Saruman’s tower still stands, sealed above the flooded plain.")
    ]),
    page("rohan", "Isengard · the voice in Orthanc", [
      beat(0, "The stairs", "Isengard · the Ring-wall", "isengard", "Isengard", "A road through the flood", "The company crosses the ruined fortress and gathers below the tower."),
      beat(.5, "The voice", "Orthanc · the high window", "orthanc", "Orthanc", "Words from the stone", "Saruman speaks from above, turning courtesy into one last attempt at power."),
      beat(.84, "The locked door", "Isengard · Orthanc", "isengard", "Isengard", "The road east resumes", "The company leaves Saruman behind the stone and takes the road back toward Rohan.")
    ]),
    page("rohan", "Isengard · the road east", [
      beat(0, "The palantír", "Isengard · the camp", "orthanc", "Orthanc", "A stone wrapped in darkness", "The seeing-stone passes from hand to hand, carrying a dangerous glimpse of the Enemy."),
      beat(.5, "Dol Baran", "Rohan · the hill at night", "dol-baran", "Dol Baran", "The last camp before dawn", "The company rests beneath the lonely hill while the stone’s image still burns in memory."),
      beat(.84, "The Eastemnet", "Rohan · the road east", "eastemnet", "Eastemnet", "The host divides", "The king rides toward Edoras while the road of the Ring turns away across the plains.")
    ]),
    page("mordor", "The Emyn Muil · eastward", [
      beat(0, "The stone hills", "The Emyn Muil · the eastern wall", "emyn-muil", "Emyn Muil", "A labyrinth above the marshes", "Frodo and Sam climb and descend among the broken hills, searching for a way down."),
      beat(.5, "Gollum", "The eastern edge of Emyn Muil", "emyn-muil", "Emyn Muil", "A creature below the ridge", "The hidden guide returns from the dark and offers a path through the lands ahead."),
      beat(.84, "The marshes", "The Dead Marshes · the northern pools", "dead-marshes", "Dead Marshes", "Pools beneath the mist", "The road east leaves the hills and enters the wet ground between Emyn Muil and Dagorlad.")
    ]),
    page("mordor", "The Dead Marshes · Dagorlad", [
      beat(0, "The way through", "The Dead Marshes · the pools", "dead-marshes", "Dead Marshes", "Lights under dark water", "Gollum leads the Hobbits between the pools where the faces of the fallen lie below."),
      beat(.5, "The straight path", "The Dead Marshes · the causeway", "dead-marshes", "Dead Marshes", "A road through the mire", "The marshes close around them while the lights and the eastern wind draw them onward."),
      beat(.84, "The Black Gate", "Mordor · the Morannon", "black-gate", "The Black Gate", "The gate of the north", "The hills open onto the iron gate and the towers guarding the only road into Mordor.")
    ]),
    page("mordor", "The Black Gate · March 5", [
      beat(0, "The Morannon", "Mordor · the Black Gate", "black-gate", "The Black Gate", "The Towers of the Teeth", "The gate is open to armies but closed to two weary travellers."),
      beat(.5, "No way in", "Mordor · Cirith Gorgor", "black-gate", "The Black Gate", "The road turns south", "Frodo and Sam watch the traffic of war and learn that the front door cannot be taken."),
      beat(.84, "The hidden road", "North Ithilien · the border", "ithilien", "Ithilien", "Back toward the green country", "Gollum leads them away from the Morannon toward the quieter paths of Ithilien.")
    ]),
    page("mordor", "Ithilien · the ranger country", [
      beat(0, "The green land", "North Ithilien · the old road", "ithilien", "Ithilien", "A garden under threat", "The country west of Mordor is still green, though the Enemy’s road cuts through its shadows."),
      beat(.5, "The ambush", "Ithilien · the forest road", "ithilien", "Ithilien", "Rangers among the trees", "Faramir’s men appear from the cover and take the travellers into their keeping."),
      beat(.84, "The Window of Sunset", "Henneth Annûn · the waterfall", "henneth-annun", "Henneth Annûn", "A hidden refuge", "Behind a fall of water lies the Gondorian refuge where the road pauses for a night.")
    ]),
    page("mordor", "Henneth Annûn · the Window on the West", [
      beat(0, "The cave behind the fall", "Henneth Annûn · the pool", "henneth-annun", "Henneth Annûn", "The hidden pool", "The Rangers’ refuge is carved into the cliff behind the falling water."),
      beat(.5, "The window", "Henneth Annûn · the western opening", "henneth-annun", "Henneth Annûn", "A view across Ithilien", "Faramir’s men keep watch over the forest and the long roads leading toward Mordor."),
      beat(.84, "The warning", "Henneth Annûn · the cave", "henneth-annun", "Henneth Annûn", "The road beyond", "Faramir sends the Hobbits onward with food, staffs, and a warning about the Morgul-road.")
    ]),
    page("mordor", "North Ithilien · the Forbidden Pool", [
      beat(0, "The leaving", "Henneth Annûn · the south road", "henneth-annun", "Henneth Annûn", "A farewell beside the fall", "The hidden refuge disappears behind them as the three travellers return to the forest."),
      beat(.5, "The pool", "Ithilien · the waterfall", "forbidden-pool", "The Forbidden Pool", "A white fall in the green", "Gollum’s secret path leads to a guarded pool beneath the cliffs."),
      beat(.84, "Southward", "Ithilien · the old road", "ithilien", "Ithilien", "Toward the Cross-roads", "The path turns south and east through the trees, keeping the Morgul Vale just beyond sight.")
    ]),
    page("mordor", "North Ithilien · the Morgul-road", [
      beat(0, "The forest road", "Ithilien · the hills", "ithilien", "Ithilien", "Between the trees and the wall", "Frodo, Sam, and Gollum move south through the last green country before Mordor."),
      beat(.5, "The Cross-roads", "Ithilien · the fallen king", "cross-roads", "The Cross-roads", "Four roads beneath the trees", "The old statue marks the meeting of the north road and the road toward Minas Morgul."),
      beat(.84, "The Morgul Vale", "The Morgul-road · the valley mouth", "morgul-vale", "Morgul Vale", "A pale light in the east", "The city and its valley appear across the road, and the hidden stair becomes the only hope.")
    ]),
    page("mordor", "Morgul Vale · Cirith Ungol", [
      beat(0, "The white city", "Morgul Vale · the bridge", "morgul-vale", "Morgul Vale", "The Tower of Dark Sorcery", "The travellers pass the city in silence while its pale light spills over the valley."),
      beat(.5, "The stairs", "Ephel Dúath · the Stairs of Cirith Ungol", "stairs", "The Stairs of Cirith Ungol", "Up the mountain wall", "Gollum leaves the road and leads them up the narrow stair toward the high pass."),
      beat(.84, "The cleft", "Cirith Ungol · the high pass", "cirith-ungol", "Cirith Ungol", "The Spider’s Cleft", "The pass lies above the Morgul Vale, with the Tower watching the road into Mordor.")
    ]),
    page("mordor", "Cirith Ungol · Shelob’s tunnel", [
      beat(0, "The dark entrance", "Cirith Ungol · the west tunnel", "cirith-ungol", "Cirith Ungol", "A door in the mountain", "The path enters the tunnel beneath the pass, where even footsteps seem to disappear."),
      beat(.5, "The webs", "Shelob’s Lair · the main passage", "shelob", "Shelob’s Lair", "The air grows still", "The tunnel forks and the first strands of webbing begin to show in the dark."),
      beat(.84, "The light", "Shelob’s Lair · the inner tunnel", "shelob", "Shelob’s Lair", "The Phial of Galadriel", "Frodo raises the light and the ancient spider comes out of the blackness.")
    ]),
    page("mordor", "Cirith Ungol · the Tower", [
      beat(0, "The sting", "Shelob’s Lair · the eastern tunnel", "shelob", "Shelob’s Lair", "A body in the dark", "Frodo falls beneath Shelob’s sting while Sam follows the orcs toward the pass."),
      beat(.5, "The Undergate", "Cirith Ungol · below the tower", "tower-cirith", "Tower of Cirith Ungol", "A gate above the pass", "The orcs carry Frodo through the tower’s lower gate, leaving Sam with the Ring and Sting."),
      beat(.84, "The tower", "Cirith Ungol · the fortress", "tower-cirith", "Tower of Cirith Ungol", "The last page of the road", "Sam climbs toward the tower while Mordor opens beyond the pass.")
    ]),
    page("gondor", "Gondor · Minas Tirith", [
      beat(0, "The White City", "Minas Tirith · the Hill of Guard", "minas-tirith", "Minas Tirith", "The city of seven levels", "The story opens in the White City, where the walls look east across the Pelennor."),
      beat(.5, "The townlands", "The Pelennor Fields · the eastern road", "pelennor", "Pelennor Fields", "Farmland below the walls", "The fields between the city and the Anduin become the ground on which the siege will gather."),
      beat(.84, "Across the river", "Osgiliath · the Anduin", "osgiliath", "Osgiliath", "The ruined river-city", "Beyond the fields, Osgiliath holds the crossing and the eastern approach to Minas Tirith.")
    ]),
    page("gondor", "Dunharrow · the Paths of the Dead", [
      beat(0, "Dunharrow", "The White Mountains · the Firienfeld", "dunharrow", "Dunharrow", "The refuge above Harrowdale", "The Grey Company gathers at the high refuge beneath the White Mountains."),
      beat(.5, "The Dark Door", "The White Mountains · the Paths of the Dead", "paths-dead", "Paths of the Dead", "The way is shut", "The road passes through the haunted mountain beneath the Dwimorberg."),
      beat(.84, "The southern road", "Blackroot Vale · the road to Pelargir", "pelargir", "Pelargir", "Down to the river", "The company emerges in Gondor and follows the river-road toward the sea and the war.")
    ]),
    page("gondor", "Rohan · the road to Gondor", [
      beat(0, "The Muster", "Edoras · the Golden Hall", "edoras", "Edoras", "The Riders gather", "The host of Rohan rides from the hill of Meduseld toward the war in Gondor."),
      beat(.5, "The Grey Wood", "Drúadan Forest · the forest road", "druadan-forest", "Drúadan Forest", "A hidden road through the trees", "The Rohirrim take the old way through the forest, guided toward the eastern road."),
      beat(.84, "The beacon road", "Gondor · north of the Pelennor", "pelennor", "Pelennor Fields", "The city ahead", "The host reaches the country beyond Minas Tirith as the siege closes around the city.")
    ]),
    page("gondor", "The Siege of Gondor", [
      beat(0, "The walls", "Minas Tirith · the outer circles", "minas-tirith", "Minas Tirith", "Seven walls above the plain", "The city prepares its defenses while the enemy gathers beyond the fields."),
      beat(.5, "The river crossing", "Osgiliath · the eastern bank", "osgiliath", "Osgiliath", "The broken bridge", "The assault presses across the Anduin and toward the causeway forts."),
      beat(.84, "The Rammas", "The Pelennor Fields · the east gate", "pelennor", "Pelennor Fields", "The ring around the townlands", "The siege reaches the outer wall and the city is cut off from the open country.")
    ]),
    page("gondor", "The Ride of the Rohirrim", [
      beat(0, "The hidden host", "Drúadan Forest · the old road", "druadan-forest", "Drúadan Forest", "A road beneath the branches", "The Riders move unseen through the forest while the battle waits beyond the hills."),
      beat(.5, "The road opens", "Anórien · the north road", "pelennor", "The Pelennor Road", "Between forest and wall", "The host leaves the hidden road and turns toward the fields below Minas Tirith."),
      beat(.84, "The charge", "The Pelennor Fields · before dawn", "pelennor", "Pelennor Fields", "The horns of Rohan", "The Riders break from the dark and descend upon the besieging army.")
    ]),
    page("gondor", "The Battle of the Pelennor Fields", [
      beat(0, "The field", "The Pelennor Fields · east of the city", "pelennor", "Pelennor Fields", "Farmland turned battlefield", "The fields fill with horsemen, standards, smoke, and the armies of the Dark Lord."),
      beat(.5, "The city wall", "Minas Tirith · the Gate", "minas-tirith", "Minas Tirith", "The White City under attack", "The battle reaches the walls while the defenders fight to hold the gate."),
      beat(.84, "The turning", "The Pelennor Fields · the southern road", "pelennor", "Pelennor Fields", "A victory with a cost", "The tide turns across the fields, but the war is not yet finished.")
    ]),
    page("gondor", "Minas Tirith · Rath Dínen", [
      beat(0, "The pyre", "Minas Tirith · the Citadel", "rath-dinen", "Rath Dínen", "The Silent Street", "The high city falls quiet as Denethor prepares a final act beneath the White Tower."),
      beat(.5, "The White Tower", "Minas Tirith · the seventh circle", "minas-tirith", "Minas Tirith", "Above the seven walls", "The city watches from the height while the fires burn below."),
      beat(.84, "The field below", "The Pelennor Fields · after the battle", "pelennor", "Pelennor Fields", "Smoke over the townlands", "The wounded and the victors remain among the ruined farms outside the walls.")
    ]),
    page("gondor", "Minas Tirith · the Houses of Healing", [
      beat(0, "The Houses", "Minas Tirith · the sixth circle", "houses-healing", "Houses of Healing", "The city’s quiet quarter", "The wounded are carried up into the city while healers search for a way to call them back."),
      beat(.5, "The herb-master", "Minas Tirith · the Houses of Healing", "houses-healing", "Houses of Healing", "Athelas and memory", "The old lore of healing returns to the White City."),
      beat(.84, "The king’s hands", "Minas Tirith · the houses", "minas-tirith", "Minas Tirith", "The city wakes", "Hope spreads upward through the circles as the wounded begin to stir.")
    ]),
    page("gondor", "Gondor · the Last Debate", [
      beat(0, "The council", "Minas Tirith · the Citadel", "minas-tirith", "Minas Tirith", "The high court", "The leaders of the West meet above the city to decide what can still be done."),
      beat(.5, "The road east", "The Pelennor Fields · the north road", "pelennor", "Pelennor Fields", "A last march", "The host leaves the city and crosses the fields toward the enemy’s gate."),
      beat(.84, "Toward the Morannon", "The road to Mordor · eastward", "morgul-road", "The road to Mordor", "A road made to draw the eye", "The Army of the West advances to make one final challenge before the Black Gate.")
    ]),
    page("mordor-heart", "Mordor · the Black Gate", [
      beat(0, "The Morannon", "Mordor · the Black Gate", "black-gate", "The Black Gate", "The mouth of Udûn", "The host of the West reaches the iron gate beneath the Towers of the Teeth."),
      beat(.5, "Dagorlad", "Dagorlad · before Mordor", "dagorlad", "Dagorlad", "The battle plain", "The open ground before the gate becomes the last stand of the Free Peoples."),
      beat(.84, "The challenge", "Udûn · beneath the Black Gate", "udun", "Udûn", "A small hope before the gate", "The captains stand before Mordor and wait for the answer of the Dark Lord.")
    ]),
    page("mordor", "Cirith Ungol · the Tower", [
      beat(0, "The tower", "Cirith Ungol · the high pass", "tower-cirith", "Tower of Cirith Ungol", "A fortress above the cleft", "Sam reaches the tower while the armies of the West draw the Enemy’s gaze northward."),
      beat(.5, "The pass", "Cirith Ungol · the eastern road", "cirith-ungol", "Cirith Ungol", "The gate into Mordor", "The road leaves the mountain pass and opens onto the ash of the Black Land."),
      beat(.84, "The road ahead", "Mordor · the western edge", "tower-cirith", "Tower of Cirith Ungol", "Beyond the tower", "Frodo and Sam begin the long descent toward the heart of Mordor.")
    ]),
    page("mordor-heart", "Mordor · the Land of Shadow", [
      beat(0, "The ash road", "Mordor · west of Gorgoroth", "tower-cirith", "The road from Cirith Ungol", "A land without shelter", "The Hobbits cross the ash-strewn borderland beneath the mountains."),
      beat(.5, "Gorgoroth", "The Plateau of Gorgoroth", "gorgoroth", "Gorgoroth", "The mined plain", "The road turns across the barren plateau, between the Dark Tower and the fire mountain."),
      beat(.84, "The Dark Tower", "Gorgoroth · the road to Barad-dûr", "barad-dur", "Barad-dûr", "The fortress in the east", "Barad-dûr rises beyond the plain, bound to the road that runs toward Mount Doom.")
    ]),
    page("mordor-heart", "Mordor · Mount Doom", [
      beat(0, "Across Gorgoroth", "The Plateau of Gorgoroth · southward", "gorgoroth", "Gorgoroth", "The empty plain", "The road bends away from the Dark Tower and the mountain grows larger before them."),
      beat(.5, "Orodruin", "Mount Doom · the eastern slope", "mount-doom", "Mount Doom", "The mountain of fire", "The last climb follows the road toward the cone and the Sammath Naur."),
      beat(.84, "The Cracks of Doom", "Mount Doom · Sammath Naur", "cracks-doom", "The Cracks of Doom", "The fire beneath the Ring", "At the heart of the mountain, the long journey reaches its terrible end.")
    ]),
    page("gondor", "Ithilien · the Field of Cormallen", [
      beat(0, "The field", "Ithilien · the Field of Cormallen", "cormallen", "Field of Cormallen", "A green camp beneath the trees", "The survivors wake in Ithilien, far from the fire and darkness of Mordor."),
      beat(.5, "The river country", "Ithilien · east of the Anduin", "cormallen", "Field of Cormallen", "The land restored to light", "The camp lies among the gardens and rivers of Gondor’s eastern land."),
      beat(.84, "The return", "Minas Tirith · the City of Kings", "minas-tirith", "Minas Tirith", "Home to the White City", "The Ring-bearers are carried back toward the city where the new age will be proclaimed.")
    ]),
    page("gondor", "Minas Tirith · the Steward and the King", [
      beat(0, "The Citadel", "Minas Tirith · the White Tower", "minas-tirith", "Minas Tirith", "The city in festival", "The White City prepares for a king and for the healing of the realm."),
      beat(.5, "The crown", "Minas Tirith · the Citadel", "rath-dinen", "The Citadel", "The high place of Gondor", "The road of the story rises to the summit of the city and the return of the King."),
      beat(.84, "The city gate", "Minas Tirith · the Gate", "minas-tirith", "Minas Tirith", "A new beginning", "The long war gives way to a kingdom, a wedding, and the first peace of the Fourth Age.")
    ]),
    page("rohan", "The road home · Many Partings", [
      beat(0, "The White City", "Minas Tirith · the northern road", "edoras", "The road from Gondor", "Leaving the city", "The company turns north and west, carrying the memory of the war into the lands behind it."),
      beat(.5, "Edoras", "Rohan · Meduseld", "edoras", "Edoras", "The Golden Hall again", "The road reaches Rohan, where old friends and old promises are met once more."),
      beat(.84, "Isengard", "Isengard · the Ring of stone", "isengard", "Isengard", "The broken fortress", "The journey passes through the ruins of Saruman’s country before turning north toward home.")
    ]),
    page("shire", "The East Road · homeward bound", [
      beat(0, "The long road", "The East Road · west of Bree", "east-road", "The East Road", "The road beneath the Downs", "The travellers leave Bree-land and take the familiar road back toward the Shire."),
      beat(.5, "The green country", "The Shire · the western road", "hobbiton", "Hobbiton", "A land nearly remembered", "The hills and hedges return, though the quiet country is not quite as it was."),
      beat(.84, "Bag End", "Hobbiton · the Hill", "bag-end", "Bag End", "The round door at home", "The road ends at the Hill, where the story’s first house waits beneath the evening light.")
    ]),
    page("shire", "The Shire · the Scouring", [
      beat(0, "Bywater", "The Shire · Bywater", "hobbiton", "Bywater", "The lanes under threat", "The return reveals fences, mills, and strangers where the Shire’s fields and gardens used to be."),
      beat(.5, "The trees", "The Shire · the Party Tree", "party-field", "The Party Field", "A field to be reclaimed", "The Hobbits gather the Shire and turn its own green country against the men who have spoiled it."),
      beat(.84, "Bagshot Row", "Hobbiton · the Hill", "bag-end", "Bag End", "The Hill restored", "The old order returns by work and courage, not by pretending the damage never happened.")
    ]),
    page("lindon", "The Grey Havens · the end of the Third Age", [
      beat(0, "The Far Downs", "The Shire · west of the Tower Hills", "shire", "The Far Downs", "The last road west", "The road leaves the Shire and runs beneath the Downs toward the distant sea."),
      beat(.5, "The Tower Hills", "Lindon · Emyn Beraid", "tower-hills", "The Tower Hills", "The first sight of the Sea", "From the western hills, the travellers look out toward the long firth of Lhûn."),
      beat(.84, "Mithlond", "Lindon · the Grey Havens", "grey-havens", "The Grey Havens", "The white ship", "At the Havens, the road ends beside the water and the ship waits for the West.")
    ])
  ]);

  var positions = {
    shire: { "bag-end": [43, 42], hobbiton: [51, 49], "party-field": [29, 32], "woody-end": [55, 30], "east-road": [83, 70], crickhollow: [88, 78], "maggots-farm": [72, 72], "bucklebury-ferry": [80, 82], "old-forest-gate": [24, 48] },
    "old-forest": { "forest-gate": [20, 47], "old-willow": [47, 58], withywindle: [59, 65], "tom-house": [67, 73], "barrow-downs": [78, 44], "east-road": [75, 82] },
    "bree-weather": { bree: [40, 49], "prancing-pony": [40, 49], "east-road": [59, 56], weathertop: [79, 25] },
    trollshaws: { "last-bridge": [22, 50], trollshaws: [45, 36], "ford-bruinen": [74, 55], rivendell: [73, 34], council: [73, 34] },
    moria: { rivendell: [12, 73], hollin: [12, 73], "redhorn-pass": [43, 28], "doors-of-durin": [33, 65], moria: [40, 65], "bridge-khazad-dum": [66, 55], "dimrill-dale": [78, 72] },
    lothlorien: { "dimrill-dale": [47, 55], nimrodel: [36, 45], "caras-galadhon": [47, 39], mirror: [48, 42], "boat-landing": [77, 75], anduin: [78, 60] },
    anduin: { anduin: [50, 35], argonath: [49, 47], "nen-hithoel": [52, 70], "parth-galen": [36, 80], "amon-hen": [37, 83], rauros: [54, 91] },
    rohan: { "parth-galen": [82, 16], "amon-hen": [80, 20], "emyn-muil": [82, 24], eastemnet: [68, 39], fangorn: [52, 31], wellinghall: [48, 28], isengard: [19, 31], orthanc: [19, 31], edoras: [50, 70], meduseld: [50, 70], westfold: [31, 58], "fords-isen": [25, 43], "helm-deep": [22, 77], hornburg: [22, 77], "dol-baran": [36, 39] },
    mordor: { "emyn-muil": [15, 16], "dead-marshes": [39, 26], "black-gate": [75, 20], ithilien: [29, 46], "henneth-annun": [30, 54], "forbidden-pool": [34, 57], "cross-roads": [54, 53], "morgul-vale": [73, 59], stairs: [74, 72], "cirith-ungol": [80, 79], shelob: [64, 76], "tower-cirith": [84, 82] },
    gondor: { "minas-tirith": [75, 47], pelennor: [62, 53], osgiliath: [53, 45], dunharrow: [31, 77], "paths-dead": [38, 71], pelargir: [42, 88], "druadan-forest": [46, 34], cormallen: [28, 36], "rath-dinen": [73, 39], "houses-healing": [70, 49], "morgul-road": [83, 56], edoras: [20, 28] },
    "mordor-heart": { "black-gate": [25, 22], dagorlad: [29, 31], udun: [40, 32], "tower-cirith": [82, 64], "cirith-ungol": [77, 60], gorgoroth: [56, 45], "barad-dur": [72, 37], "mount-doom": [51, 68], "cracks-doom": [54, 77] },
    lindon: { shire: [20, 55], "tower-hills": [52, 45], "grey-havens": [80, 52], "lindon-coast": [87, 52] }
  };

  var regionLabels = {
    shire: "the shire",
    "old-forest": "the old forest",
    "bree-weather": "bree-land",
    trollshaws: "the trollshaws",
    moria: "moria",
    lothlorien: "lothlórien",
    anduin: "the great river",
    rohan: "rohan & fangorn",
    mordor: "ithilien & mordor",
    gondor: "gondor",
    "mordor-heart": "mordor",
    lindon: "lindon"
  };

  function roman(number) {
    var values = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    var output = "";
    values.forEach(function (pair) { while (number >= pair[0]) { output += pair[1]; number -= pair[0]; } });
    return output;
  }

  function formatTime(seconds) {
    seconds = Math.max(0, Math.floor(Number(seconds) || 0));
    return Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char];
    });
  }

  function normalizeFilename(value) { return String(value || "").toLowerCase().replace(/\s+/g, " ").trim(); }

  function metadataFor(index) {
    return chapterMeta[index] || page("shire", "The Shire", [beat(0, "The journey", "The road", "bag-end", "The road", "A new page", "The next part of the journey opens.")]);
  }

  function buildScenes(chapter, meta) {
    var tracked = window.POC_BUILD_TRACKED_SCENES && window.POC_BUILD_TRACKED_SCENES(chapter, currentChapterIndex);
    if (tracked) return tracked;
    return meta.beats.map(function (item, index) {
      var next = meta.beats[index + 1];
      var start = Math.max(0, Math.min(chapter.duration, Math.floor(chapter.duration * item.ratio)));
      var end = next ? Math.max(start + 1, Math.floor(chapter.duration * next.ratio)) : chapter.duration;
      return { id: chapter.id + "-scene-" + index, start: start, end: end, title: item.title, location: item.location, map: item.map, mapTitle: item.mapTitle, subtitle: item.subtitle, desc: item.desc };
    });
  }

  function sceneFor(time) {
    var found = scenes[0];
    scenes.forEach(function (scene) { if (time >= scene.start) found = scene; });
    return found || { id: "empty", start: 0, end: currentChapter ? currentChapter.duration : 1, title: "The journey", location: "The road", map: "bag-end", mapTitle: "The road", subtitle: "A new page", desc: "" };
  }

  function cueIndexFor(time) {
    var low = 0, high = cues.length - 1, answer = -1;
    while (low <= high) {
      var mid = Math.floor((low + high) / 2);
      if (cues[mid].start <= time) { answer = mid; low = mid + 1; } else high = mid - 1;
    }
    return answer;
  }

  function renderScenes() {
    sceneList.innerHTML = scenes.map(function (scene) {
      return '<a class="scene" title="' + escapeHtml(scene.title + (scene.evidence ? ' · ' + scene.evidence : ' · approximate timing')) + '" aria-label="' + escapeHtml(scene.title + ', ' + formatTime(scene.start)) + '" href="?chapter=' + (currentChapterIndex + 1) + '&at=' + scene.start + '" data-start="' + scene.start + '" data-scene="' + scene.id + '">' +
        '<span class="scene-time">' + formatTime(scene.start) + '</span><span><span class="scene-title">' + escapeHtml(scene.title) + '</span><span class="scene-detail">' + escapeHtml(scene.location) + '</span></span></a>';
    }).join("");
    sceneList.querySelectorAll(".scene").forEach(function (button) { button.addEventListener("click", function (event) { event.preventDefault(); seek(Number(button.dataset.start)); }); });
  }

  function renderCues(index) {
    if (!cues.length) {
      cueList.dataset.chapter = currentChapter ? currentChapter.id : "";
      cueList.innerHTML = '<div class="cue current">Transcript data could not be loaded for this page.</div>';
      return;
    }

    var safeIndex = Number(index);
    if (!Number.isInteger(safeIndex)) safeIndex = -1;
    safeIndex = Math.max(-1, Math.min(cues.length - 1, safeIndex));
    var chapterKey = currentChapter ? currentChapter.id : "";

    // Render the complete chapter once. Playback updates only the classes and
    // scroll position, so the whole transcript stays available without
    // rebuilding hundreds of cue nodes on every timeupdate.
    if (cueList.dataset.chapter !== chapterKey || cueList.children.length !== cues.length) {
      cueList.dataset.chapter = chapterKey;
      cueList.innerHTML = cues.map(function (cue, absolute) {
        return '<a class="cue" href="?chapter=' + (currentChapterIndex + 1) + '&at=' + cue.start + '" data-start="' + cue.start + '" data-index="' + absolute + '"><time>' + formatTime(cue.start) + '</time><span class="cue-text">' + escapeHtml(cue.text) + '</span></a>';
      }).join("");
      cueList.scrollTop = 0;
      cueList.querySelectorAll(".cue").forEach(function (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          seek(Number(button.dataset.start));
        });
      });
    }

    if (paintedCue) paintedCue.classList.remove('current');
    var active = safeIndex >= 0 ? cueList.children[safeIndex] : null;
    if (active) active.classList.add('current');
    paintedCue = active;
    if (active && Date.now() >= manualScrollUntil) {
      var top = active.offsetTop;
      if (top < cueList.scrollTop || top + active.offsetHeight > cueList.scrollTop + cueList.clientHeight) cueList.scrollTop = Math.max(0, top - 32);
    }
  }

  function defaultAudioFor(chapter) {
    var folder = chapter.audioDir || "Part1";
    var encodedFolder = encodeURIComponent(folder);
    var encoded = encodeURIComponent(chapter.audio);
    return "/LOTR-Audiobook/" + encodedFolder + "/" + encoded;
  }

  function audioFor(chapter) { return selectedAudio[normalizeFilename(chapter.audio)] || defaultAudioFor(chapter); }

  function setRegion(region) {
    var regional = true;
    map.classList.toggle("regional-active", regional);
    mapPanelTitle.textContent = regionLabels[region] || "the journey";
    mapPanelKicker.textContent = regional ? "journey chart" : "regional chart";
    shireMap.setAttribute("aria-hidden", regional ? "true" : "false");
    regionalMap.setAttribute("aria-hidden", regional ? "false" : "true");
    if (regional && regionalMap.dataset.region !== region) {
      regionalMap.innerHTML = (window.POC_REGIONAL_PLATES || {})[region] || "";
      regionalMap.dataset.region = region;
    }
    if (regional) regionalMap.setAttribute("aria-label", currentMeta.pageMeta);
  }

  function positionFor(region, target) {
    var set = (window.POC_MAP_POSITIONS || {})[region] || positions[region] || {};
    return set[target] || set["bag-end"] || [50, 50];
  }

  function updateScene(time) {
    var scene = sceneFor(time);
    var sceneRegion = scene.region || currentMeta.region;
    if (scene.id !== currentSceneId) {
      setRegion(sceneRegion);
      var largeMap = document.querySelector('.atlas-dialog[open] svg');
      if (largeMap) largeMap.innerHTML = regionalMap.innerHTML.replace(/id="([^"]+)"/g, 'id="large-$1"').replace(/url\(#([^\)]+)\)/g, 'url(#large-$1)');
      currentSceneId = scene.id;
      sceneTitle.textContent = scene.title;
      sceneLocation.textContent = scene.location;
      sceneDescription.textContent = scene.desc;
      mapLocation.textContent = scene.mapTitle;
      mapSubtitle.textContent = scene.subtitle;
      map.classList.toggle("night", currentChapterIndex === 0 && scene.start >= 2020);
      map.classList.toggle("day", !map.classList.contains("night"));
      map.classList.toggle("party-time", currentChapterIndex === 0 && scene.map === "party-field");
      document.querySelectorAll(".scene").forEach(function (button) { button.classList.toggle("is-current", button.dataset.scene === scene.id); });
    var target = positionFor(sceneRegion, scene.map);
    party.style.left = target[0] + "%";
    party.style.top = target[1] + "%";
    document.querySelectorAll("#atlas-current, #large-atlas-current").forEach(function (atlasMarker) {
      atlasMarker.setAttribute("transform", "translate(" + (target[0] * 9.6) + " " + (target[1] * 6.2) + ")");
      atlasMarker.setAttribute("visibility", "visible");
      atlasMarker.querySelector("title").textContent = scene.mapTitle;
    });
    }
    var length = Math.max(1, scene.end - scene.start);
    sceneProgress.style.transform = 'scaleX(' + Math.min(1, Math.max(0, (time - scene.start) / length)) + ')';
    if (window.POC_UPDATE_COMPANY) window.POC_UPDATE_COMPANY({chapter:currentChapterIndex+1,time:time,scene:scene,region:sceneRegion,position:positionFor(sceneRegion,scene.map),milestones:scenes.filter(function(s){return s.start<=time;}),visited:scenes.filter(function(s){return s.start<=time&&(s.region||currentMeta.region)===sceneRegion;}).map(function(s){return positionFor(sceneRegion,s.map);})});
  }

  function updateTranscript(time) {
    var next = cueIndexFor(time);
    if (next !== currentCue) {
      currentCue = next; renderCues(currentCue);
      cueStatus.textContent = next >= 0 && cues[next] ? formatTime(cues[next].start) + " · synced" : "waiting for audio";
    }
  }

  function update() { if (!currentChapter) return; var time = pendingSeek === null ? Number(audio.currentTime) || 0 : pendingSeek; updateScene(time); updateTranscript(time); savePlace(false); }

  function applyPendingSeek() {
    if (pendingSeek === null || audio.readyState < 1) return;
    var target = pendingSeek;
    pendingSeek = null;
    try {
      audio.currentTime = target;
      chapterLoading = false;
      update();
    } catch (error) {
      pendingSeek = target;
    }
  }

  function seek(seconds) {
    manualScrollUntil = 0;
    var limit = currentChapter ? currentChapter.duration : Number(audio.duration) || 0;
    var target = Math.max(0, Math.min(Number(limit) || 0, Number(seconds) || 0));
    pendingSeek = target;
    applyPendingSeek();
    update();
    if (audio.paused) audio.play().catch(function () {});
  }
  window.POC_SEEK = seek;

  function showNotice(text) { notice.textContent = text; notice.classList.add("visible"); }

  function loadChapter(index, options) {
    options = options || {};
    if (!chapters.length) { showNotice("No audiobook transcript data was found."); return; }
    savePlace(true);
    chapterLoading = true;
    audio.pause();
    currentChapterIndex = Math.max(0, Math.min(chapters.length - 1, Number(index) || 0));
    currentChapter = chapters[currentChapterIndex];
    currentMeta = metadataFor(currentChapterIndex);
    cues = currentChapter.cues || [];
    scenes = buildScenes(currentChapter, currentMeta);
    currentCue = -1;
    manualScrollUntil = 0;
    currentSceneId = "";
    var saved = bookmarks && bookmarks.get(currentChapter.id);
    var targetTime = Number.isFinite(options.at) ? options.at : saved ? saved.time : 0;
    targetTime = Math.max(0, Math.min(targetTime, currentChapter.duration));
    pendingSeek = targetTime;
    bookEyebrow.textContent = 'The Red Book of Westmarch · ' + (currentChapter.partLabel || "Book One");
    bookTitle.textContent = currentChapter.title.replace(/\s+(?:\(\d{4}\)|\d{4}|256)$/, "");
    chapterLabel.textContent = "Chapter " + roman(currentChapter.number);
    pageMeta.textContent = currentMeta.pageMeta;
    pageCount.textContent = "Page " + (currentChapterIndex + 1) + " of " + chapters.length;
    document.getElementById('chapter-picker').value = String(currentChapterIndex);
    document.getElementById("previous-page").disabled = currentChapterIndex === 0;
    document.getElementById("next-page").disabled = currentChapterIndex === chapters.length - 1;
    document.getElementById("next-page-player").disabled = currentChapterIndex === chapters.length - 1;
    audioName.textContent = currentChapter.audio;
    setRegion(currentMeta.region);
    renderScenes();
    renderCues(-1);
    updateScene(targetTime);
    updateTranscript(targetTime);
    var source = audioFor(currentChapter);
    if (audio.dataset.chapter !== currentChapter.id || audio.dataset.source !== source) {
      audio.dataset.chapter = currentChapter.id;
      audio.dataset.source = source;
      audio.src = source;
      audio.load();
    }
    if (saved) {
      if (Number.isFinite(saved.rate) && saved.rate >= .25 && saved.rate <= 4) audio.playbackRate = saved.rate;
      if (Number.isFinite(saved.volume)) audio.volume = Math.max(0, Math.min(1, saved.volume));
      audio.muted = !!saved.muted;
      if (targetTime > 0) bookmarks.announce();
    }
    notice.classList.remove('visible');
    applyPendingSeek();
    try { history.replaceState({}, "", "?chapter=" + (currentChapterIndex + 1)); } catch (error) { }
    if (options.autoplay) audio.play().catch(function () {});
  }

  function turnPage(delta, autoplay) {
    if (turnLocked) return;
    var target = currentChapterIndex + delta;
    if (target < 0 || target >= chapters.length) return;
    var duration = window.POC_ANIMATE_PAGE ? window.POC_ANIMATE_PAGE(delta) : 0;
    turnLocked = duration > 0;
    loadChapter(target, { autoplay: autoplay !== false });
    if (window.POC_FINISH_PAGE) window.POC_FINISH_PAGE();
    if (turnLocked) window.setTimeout(function () { turnLocked = false; }, duration);
  }
  window.POC_TURN_PAGE = turnPage;

  var chapterPicker = document.createElement('select');
  chapterPicker.id = 'chapter-picker';
  chapterPicker.setAttribute('aria-label', 'Jump to chapter');
  var bookNames = ['The Fellowship of the Ring', 'The Two Towers', 'The Return of the King'];
  bookNames.forEach(function (name, part) {
    var group = document.createElement('optgroup'); group.label = name;
    chapters.forEach(function (chapter, index) {
      if ((index < 22 ? 0 : index < 43 ? 1 : 2) !== part) return;
      var option = document.createElement('option'); option.value = String(index);
      option.textContent = chapter.number + '. ' + chapter.title.replace(/\s+(?:\(\d{4}\)|\d{4}|256)$/, '');
      group.appendChild(option);
    });
    chapterPicker.appendChild(group);
  });
  document.querySelector('.page-turner').prepend(chapterPicker);
  chapterPicker.addEventListener('change', function () {
    if (turnLocked) { chapterPicker.value = String(currentChapterIndex); return; }
    var index = Number(chapterPicker.value);
    if (index === currentChapterIndex) return;
    var duration = window.POC_ANIMATE_PAGE ? window.POC_ANIMATE_PAGE(index > currentChapterIndex ? 1 : -1) : 0;
    turnLocked = duration > 0;
    loadChapter(index, { autoplay: false });
    if (window.POC_FINISH_PAGE) window.POC_FINISH_PAGE();
    if (turnLocked) window.setTimeout(function () { turnLocked = false; }, duration);
  });

  document.getElementById("previous-page").addEventListener("click", function () { turnPage(-1, false); });
  document.getElementById("next-page").addEventListener("click", function () { turnPage(1, true); });
  document.getElementById("next-page-player").addEventListener("click", function () { turnPage(1, true); });
  document.getElementById("jump-button").addEventListener("click", function () { seek(0); audio.play().catch(function () {}); });
  audio.addEventListener("error", function () { showNotice("Audio unavailable. Check the matching MP3 in your local Part1, Part2, or Part3 folder and the server’s audio-directory setting."); });
  audio.addEventListener("loadedmetadata", applyPendingSeek);
  audio.addEventListener("canplay", applyPendingSeek);
  audio.addEventListener("timeupdate", update);
  audio.addEventListener('pause', function () { savePlace(true); });
  audio.addEventListener('seeked', function () { update(); savePlace(true); });
  audio.addEventListener('ratechange', function () { savePlace(true); });
  audio.addEventListener('volumechange', function () { savePlace(true); });
  window.addEventListener('pagehide', function () { savePlace(true); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) savePlace(true); });
  audio.addEventListener("loadedmetadata", update);
  audio.addEventListener("durationchange", update);
  audio.addEventListener("ended", function () { savePlace(true); if (currentChapterIndex < chapters.length - 1) turnPage(1, false); });

  var audioFileInput = document.getElementById("audio-file");
  if (audioFileInput) audioFileInput.addEventListener("change", function (event) {
    var files = Array.prototype.slice.call(event.target.files || []);
    if (!files.length) return;
    selectedAudio = {};
    selectedAudioUrls.forEach(function (url) { URL.revokeObjectURL(url); });
    selectedAudioUrls = [];
    files.forEach(function (file) {
      var url = URL.createObjectURL(file);
      selectedAudio[normalizeFilename(file.name)] = url;
      selectedAudioUrls.push(url);
    });
    notice.classList.remove("visible");
    loadChapter(currentChapterIndex, { autoplay: false });
  });

  document.addEventListener("keydown", function (event) {
    var tag = event.target && event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || event.target.closest('button, audio, dialog, [contenteditable="true"]')) return;
    if (event.code === "Space") {
      event.preventDefault();
      if (audio.paused) audio.play().catch(function () {}); else audio.pause();
    } else if (event.code === "ArrowRight" || event.code === "PageDown") {
      event.preventDefault(); turnPage(1, true);
    } else if (event.code === "ArrowLeft" || event.code === "PageUp") {
      event.preventDefault(); turnPage(-1, false);
    }
  });

  var params = new URLSearchParams(location.search);
  var chapterQuery = Number(params.get('chapter'));
  var lastPlace = bookmarks && bookmarks.last();
  var resumeIndex = lastPlace ? chapters.findIndex(function (c) { return c.id === lastPlace.id; }) : 0;
  var initialChapter = Number.isInteger(chapterQuery) && chapterQuery >= 1 && chapterQuery <= chapters.length ? chapterQuery - 1 : Math.max(0, resumeIndex);
  var initialAt = params.has('at') ? Number(params.get('at')) : NaN;
  loadChapter(initialChapter, { autoplay: false, at: Number.isFinite(initialAt) && initialAt >= 0 ? initialAt : undefined });
}());
