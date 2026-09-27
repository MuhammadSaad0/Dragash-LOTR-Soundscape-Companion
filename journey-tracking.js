/* Reviewed narrative milestones, in seconds, from this user's transcription files.
 * Never move the party merely because a place is mentioned in speech or a song.
 * Unreviewed chapters keep the existing approximate scene timing.
 */
(function(){
  'use strict';
  // [time, regional plate, location key, displayed scene]. Timestamps snap to the
  // closest transcript cue; source text is retained in the milestone tooltip.
  const routes={
    1:[[0,'shire','bag-end','An unexpected celebration'],[1068,'shire','party-field','The long-expected party'],[2029,'shire','bag-end','Back at Bag End']],
    2:[[0,'shire','bag-end','The shadow of the past']],
    3:[[0,'shire','bag-end','Preparing to leave'],[933,'shire','hobbiton','Leaving the Hill'],[1035,'shire','water-crossing','Across the Water'],[1047,'shire','east-road-crossing','Across the Great Road'],[1201,'shire','green-hills','A night in the Green Hills'],[2017,'shire','woody-end','Into Woody End'],[2488,'shire','woody-end','Gildor’s company']],
    4:[[0,'shire','woody-end','Morning in Woody End'],[589,'shire','marish','Down into the Marish'],[999,'shire','maggots-farm','Farmer Maggot’s farm'],[1736,'shire','ferry-lane','The lane to the ferry']],
    5:[[0,'shire','bucklebury-ferry','Across the Brandywine'],[355,'shire','crickhollow','The house at Crickhollow']],
    6:[[0,'shire','crickhollow','Before dawn'],[183,'old-forest','forest-gate','Beyond the Hedge'],[1128,'old-forest','old-willow','The Withywindle valley'],[1743,'old-forest','old-willow','A voice in the forest'],[2228,'old-forest','tom-house','The house under hill']],
    7:[[0,'old-forest','tom-house','In the house of Tom Bombadil']],
    8:[[0,'old-forest','tom-house','Farewell to Goldberry'],[324,'old-forest','barrow-downs','Among the Barrow-downs'],[2105,'old-forest','east-road','The East Road at last']],
    9:[[0,'bree-weather','bree','At the Prancing Pony']],
    10:[[0,'bree-weather','prancing-pony','Strider']],
    12:[[0,'bree-weather','weathertop','Leaving Weathertop'],[663,'trollshaws','last-bridge','Across the Last Bridge'],[1258,'trollshaws','trollshaws','The woods of the Trollshaws'],[2395,'trollshaws','ford-bruinen','The Ford of Bruinen']],
    13:[[0,'trollshaws','rivendell','Many meetings in Rivendell']],
    14:[[0,'trollshaws','rivendell','The Council of Elrond']],
    15:[[0,'trollshaws','rivendell','The company prepares'],[1596,'trollshaws','ford-bruinen','South from the Ford'],[1891,'moria','hollin','The land of Hollin'],[2707,'moria','redhorn-pass','On the slopes of Caradhras']],
    16:[[0,'moria','redhorn-pass','The retreat from Caradhras'],[1401,'moria','doors-of-durin','The Doors of Durin'],[1914,'moria','moria','Into Moria']],
    17:[[0,'moria','moria','The Chamber of Mazarbul'],[1475,'moria','bridge-khazad-dum','The Bridge of Khazad-dûm'],[1954,'moria','dimrill-dale','Out into the daylight']],
    18:[[0,'lothlorien','dimrill-dale','Dimrill Dale'],[1040,'lothlorien','nimrodel','Beside the Nimrodel'],[2973,'lothlorien','cerin-amroth','Cerin Amroth']],
    19:[[0,'lothlorien','caras-galadhon','Caras Galadhon'],[1389,'lothlorien','mirror','The Mirror of Galadriel']],
    20:[[0,'lothlorien','caras-galadhon','Preparing to depart'],[762,'lothlorien','boat-landing','The Elven quay'],[1803,'anduin','upper-anduin','Upon the Great River']],
    21:[[0,'anduin','upper-anduin','South upon Anduin'],[993,'anduin','sarn-gebir','The rapids of Sarn Gebir'],[2144,'anduin','argonath','The Pillars of the Kings'],[2396,'anduin','nen-hithoel','Nen Hithoel'],[2454,'anduin','parth-galen','The western shore']],
    22:[[0,'anduin','parth-galen','The breaking of the Fellowship'],[325,'anduin','amon-hen','Up the slopes of Amon Hen'],[1998,'anduin','parth-galen','Back to the boats'],[2296,'anduin','eastern-shore','Frodo and Sam cross the river']],
    28:[[0,'rohan','edoras','The Golden Hall']],
    29:[[0,'rohan','edoras','Riding west from Edoras'],[400,'rohan','westfold','Turning toward the Deep'],[874,'rohan','helm-deep','Within Helm’s Dike']],
    30:[[0,'rohan','helm-deep','After the battle'],[1624,'rohan','fords-isen','The road beside the Isen'],[2374,'rohan','isengard','The broken gates of Isengard']],
    31:[[0,'rohan','isengard','Flotsam and jetsam']],
    32:[[0,'rohan','orthanc','The voice of Saruman']],
    33:[[0,'rohan','isengard','Leaving Isengard'],[249,'rohan','dol-baran','The camp at Dol Baran'],[1494,'rohan','fords-isen','Shadowfax crosses the Isen']],
    34:[[0,'mordor','emyn-muil','Among the crags of Emyn Muil']],
    35:[[0,'mordor','emyn-muil','The gully below the hills'],[953,'mordor','dead-marshes','Into the Dead Marshes']],
    36:[[0,'mordor','black-gate','The Black Gate is closed']],
    37:[[0,'mordor','ithilien','In the woods of Ithilien']],
    38:[[0,'mordor','ithilien','With Faramir’s company'],[2044,'mordor','henneth-annun','The Window on the West']],
    39:[[0,'mordor','henneth-annun','The forbidden pool']],
    40:[[0,'mordor','henneth-annun','Leaving Henneth Annûn'],[374,'mordor','ithilien','South through Ithilien'],[1443,'mordor','cross-roads','The Cross-roads']],
    41:[[0,'mordor','morgul-vale','The Morgul Vale'],[1063,'mordor','stairs','The hidden stair']],
    42:[[0,'mordor','shelob','Shelob’s lair']],
    43:[[0,'mordor','cirith-ungol','The choices of Samwise']],
    47:[[0,'gondor','minas-tirith','The siege of Gondor']],
    49:[[0,'gondor','pelennor','The Battle of the Pelennor Fields']],
    50:[[0,'gondor','rath-dinen','The Pyre of Denethor']],
    51:[[0,'gondor','houses-healing','The Houses of Healing']],
    52:[[0,'gondor','minas-tirith','The last debate']],
    54:[[0,'mordor-heart','tower-cirith','The Tower of Cirith Ungol']],
    56:[[0,'mordor-heart','gorgoroth','The last miles'],[1592,'mordor-heart','mount-doom','At the foot of Mount Doom']],
    58:[[0,'gondor','minas-tirith','The Steward and the King']],
    62:[[0,'shire','bag-end','The healing of the Shire'],[1216,'shire','green-hills','The last journey begins'],[1257,'shire','woody-end','Meeting the Ring-bearers'],[1685,'lindon','tower-hills','The Towers and the distant Sea'],[1693,'lindon','grey-havens','The Grey Havens'],[1868,'lindon','westward-ship','Into the West'],[2027,'shire','bywater','Sam’s road home'],[2035,'shire','bag-end','Well, I’m back']]
  };
  Object.assign(window.POC_MAP_POSITIONS.shire,{'water-crossing':[33.5,41.5],'east-road-crossing':[36,52],'green-hills':[45,65],marish:[72,70],'ferry-lane':[77.5,72]});
  Object.assign(window.POC_MAP_POSITIONS.anduin,{'upper-anduin':[50,18],'eastern-shore':[61,77]});
  window.POC_MAP_POSITIONS.lindon['westward-ship']=[24,56];
  window.POC_TRANSCRIPT_ROUTES=routes;
  window.POC_BUILD_TRACKED_SCENES=function(chapter,index){
    const route=routes[index+1];if(!route)return null;
    const points=route.map((a,i)=>{
      const cue=a[0]===0?null:chapter.cues.reduce((best,q)=>Math.abs(q.start-a[0])<Math.abs(best.start-a[0])?q:best,chapter.cues[0]);
      return {id:chapter.id+'-milestone-'+i,start:cue?cue.start:0,region:a[1],map:a[2],title:a[3],mapTitle:a[3],location:a[1].replace(/-/g,' '),subtitle:a[3],desc:'',evidence:cue?cue.text:'Chapter setting',tracked:true};
    });
    points.forEach((a,i)=>a.end=points[i+1]?points[i+1].start:chapter.duration);
    return points;
  };
}());
