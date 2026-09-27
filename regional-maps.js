(function () {
  "use strict";

  var commonDefs = `
    <defs>
      <pattern id="regionalPaper" width="44" height="44" patternUnits="userSpaceOnUse">
        <rect width="44" height="44" fill="#e3c995"></rect>
        <path d="M0 13C9 9 15 17 24 13S38 17 48 13M-8 35C2 31 10 39 20 35S37 39 49 35" fill="none" stroke="#9a744a" stroke-width=".8" opacity=".13"></path>
        <circle cx="9" cy="25" r=".8" fill="#765236" opacity=".11"></circle><circle cx="34" cy="7" r="1" fill="#765236" opacity=".09"></circle><circle cx="39" cy="30" r=".7" fill="#765236" opacity=".1"></circle>
      </pattern>
      <filter id="regionalInk" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="2" stdDeviation="1.4" flood-color="#4a3425" flood-opacity=".22"></feDropShadow>
      </filter>
      <g id="regionalMountain">
        <path d="M0 42L24 5L48 42L66 16L92 42Z" fill="#806247" opacity=".22" stroke="#5f4634" stroke-width="2.3" stroke-linejoin="round"></path>
        <path d="M0 42L24 5L26 42Z" fill="#644832" opacity=".63"></path>
        <path d="M48 42L66 16L68 42Z" fill="#644832" opacity=".52"></path>
        <path d="M9 36L24 16L37 36M55 36L66 23L79 36" fill="none" stroke="#b18a5e" stroke-width="1.6" stroke-linecap="round"></path>
        <path d="M11 31l13 -5M16 37l14 -5M56 33l11 -4M61 38l12 -4" fill="none" stroke="#60432f" stroke-width="1.2" stroke-linecap="round"></path>
      </g>
      <g id="regionalForest">
        <path d="M5 46C-3 31 5 14 22 15C28 3 46 1 56 14C72 10 84 23 77 39C86 47 73 58 58 57C42 65 13 60 5 46Z" fill="#596046" opacity=".82" stroke="#453c2d" stroke-width="1.8"></path>
        <path d="M15 42C8 31 17 20 29 22C36 12 51 15 54 25C65 21 75 30 68 40C76 47 66 53 56 51C44 58 23 54 15 42Z" fill="#7a7a51" opacity=".48"></path>
        <path d="M12 46c12 -15 22 -11 33 -28M24 57c9 -17 21 -15 34 -31M46 57c6 -12 15 -15 24 -26" fill="none" stroke="#3f4b38" stroke-width="1.9" stroke-linecap="round" opacity=".9"></path>
        <circle cx="18" cy="23" r="2.8" fill="#a3a16b" opacity=".65"></circle><circle cx="39" cy="15" r="2.5" fill="#a3a16b" opacity=".55"></circle><circle cx="62" cy="26" r="2.8" fill="#a3a16b" opacity=".62"></circle>
      </g>
      <g id="regionalMound">
        <path d="M0 31C15 7 45 5 65 30C49 39 16 40 0 31Z" fill="#a99869" opacity=".33" stroke="#725337" stroke-width="1.5"></path>
        <path d="M10 29C24 17 40 16 56 28M20 33C31 25 43 25 52 31" fill="none" stroke="#806346" stroke-width="1.2" stroke-linecap="round"></path>
      </g>
      <g id="regionalTree">
        <path d="M25 32h10v29H25Z" fill="#76523b" stroke="#4b4434" stroke-width="2"></path>
        <path d="M30 0L8 29h13L5 48h19L10 65h40L41 48h15L43 29h13Z" fill="#596044" stroke="#3f4938" stroke-width="2.4" stroke-linejoin="round"></path>
        <path d="M30 7L18 28h25zM30 27L13 48h34zM30 45L17 63h28z" fill="#85845a" opacity=".55"></path>
      </g>
      <g id="regionalMarker">
        <circle r="7" fill="#b4543d" stroke="#eed59e" stroke-width="3"></circle>
        <path d="M0 8l-4 9 4 -3 4 3Z" fill="#81412f"></path>
      </g>
      <g id="regionalStar">
        <path d="M0 -12L3 -3L12 0L3 3L0 12L-3 3L-12 0L-3 -3Z" fill="#7c5b3e" stroke="#e7ce98" stroke-width="2"></path>
      </g>
    </defs>`;

  var frame = `
    <rect width="960" height="620" fill="url(#regionalPaper)"></rect>
    <path d="M0 74C145 49 262 89 390 61C522 34 650 89 784 58C856 41 910 50 960 63" fill="none" stroke="#a98152" stroke-width="1" opacity=".25"></path>
    <path d="M0 548C140 525 280 572 420 540C579 505 722 571 960 530" fill="none" stroke="#a98152" stroke-width="1" opacity=".18"></path>
    <rect x="16" y="16" width="928" height="588" fill="none" stroke="#765236" stroke-width="2"></rect>
    <rect x="23" y="23" width="914" height="574" fill="none" stroke="#a27b4f" stroke-width="1" opacity=".72"></rect>
    <path d="M24 48h22M24 48V26M936 48h-22M936 48V26M24 572h22M24 572v22M936 572h-22M936 572v22" fill="none" stroke="#60432e" stroke-width="2"></path>
    <path d="M29 53l10 -10M931 53l-10 -10M29 567l10 10M931 567l-10 10" fill="none" stroke="#876344" stroke-width="1.5"></path>
    <g class="regional-compass" transform="translate(872 80)">
      <circle r="27" fill="none" stroke="#745337" stroke-width="1.4"></circle>
      <path d="M0 -39L6 -6L39 0L6 6L0 39L-6 6L-39 0L-6 -6Z" fill="none" stroke="#60432e" stroke-width="1.6"></path>
      <path d="M0 -31L5 0L0 31L-5 0Z M31 0L0 5L-31 0L0 -5Z" fill="#765238" opacity=".62"></path>
      <text x="0" y="-45" text-anchor="middle">N</text><text x="46" y="4" text-anchor="middle">E</text><text x="0" y="54" text-anchor="middle">S</text><text x="-46" y="4" text-anchor="middle">W</text>
    </g>`;

  function plate(title, subtitle, aria, body) {
    return commonDefs + '<g class="regional-plate" role="img" aria-label="' + aria + '">' + frame +
      '<text x="480" y="56" text-anchor="middle" class="map-title">' + title + '</text>' +
      '<text x="480" y="79" text-anchor="middle" class="region-label">' + subtitle + '</text>' +
      body + '</g>';
  }

  window.POC_REGIONAL_PLATES = {
    "old-forest": plate("THE OLD FOREST", "Buckland · the Withywindle · the Barrow-downs", "Map of the Old Forest, Withywindle, Tom Bombadil's house, and the Barrow-downs", `
      <path d="M139 88C184 73 225 89 241 128C286 110 335 125 351 167C405 132 468 151 479 201C543 175 611 210 605 268C645 302 620 357 574 367C592 425 544 484 486 471C449 515 376 507 348 468C284 490 223 459 225 403C170 389 150 338 175 296C130 253 114 163 139 88Z" fill="#596044" opacity=".3" stroke="#4b513b" stroke-width="2"></path>
      <use href="#regionalForest" transform="translate(150 118) scale(1.03)"></use><use href="#regionalForest" transform="translate(246 135) scale(.92)"></use><use href="#regionalForest" transform="translate(350 153) scale(1.02)"></use><use href="#regionalForest" transform="translate(432 202) scale(.95)"></use><use href="#regionalForest" transform="translate(235 257) scale(1.1)"></use><use href="#regionalForest" transform="translate(347 287) scale(.93)"></use><use href="#regionalForest" transform="translate(458 326) scale(.9)"></use><use href="#regionalForest" transform="translate(297 389) scale(.87)"></use>
      <path d="M144 92C126 181 151 252 137 348C129 418 148 488 136 545" fill="none" stroke="#718d83" stroke-width="18" opacity=".5"></path>
      <path d="M144 92C126 181 151 252 137 348C129 418 148 488 136 545" fill="none" stroke="#60796f" stroke-width="2.6"></path>
      <path d="M814 115C764 169 739 221 690 270C644 315 601 351 542 401C495 442 438 474 376 505" fill="none" stroke="#91a092" stroke-width="14" opacity=".52"></path>
      <path d="M814 115C764 169 739 221 690 270C644 315 601 351 542 401C495 442 438 474 376 505" fill="none" stroke="#718273" stroke-width="2.2"></path>
      <path d="M814 115C782 155 765 184 742 211" fill="none" stroke="#718273" stroke-width="1.3" stroke-dasharray="4 7"></path>
      <path d="M187 120C222 154 216 191 243 217M184 120C216 131 247 128 269 146" fill="none" stroke="#6a543a" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"></path>
      <path d="M209 89V540" fill="none" stroke="#765236" stroke-width="5" stroke-dasharray="2 13" opacity=".86"></path>
      <path d="M184 290C264 272 320 277 371 308C413 334 444 365 510 389C557 407 596 425 634 451" fill="none" stroke="#8b6a45" stroke-width="5" opacity=".48"></path>
      <path d="M184 290C264 272 320 277 371 308C413 334 444 365 510 389C557 407 596 425 634 451" fill="none" stroke="#60432f" stroke-width="2.2" stroke-dasharray="2 8" stroke-linecap="round"></path>
      <path d="M741 117C711 141 697 162 701 186M773 134C744 157 730 181 736 203M807 152C779 174 766 195 773 219" fill="none" stroke="#806346" stroke-width="1.4" opacity=".72"></path>
      <use href="#regionalMound" transform="translate(700 273) scale(1.1)"></use><use href="#regionalMound" transform="translate(774 299) scale(.9)"></use><use href="#regionalMound" transform="translate(711 359) scale(.82)"></use><use href="#regionalMound" transform="translate(798 391) scale(1.04)"></use><use href="#regionalMound" transform="translate(727 443) scale(.76)"></use>
      <use href="#regionalTree" transform="translate(628 384) scale(.72)"></use>
      <use href="#regionalMarker" transform="translate(185 287)"></use><use href="#regionalMarker" transform="translate(633 451)"></use>
      <text x="86" y="280" class="water-label" transform="rotate(88 86 280)">BRANDYWINE</text>
      <text x="213" y="111" class="place-label">BUCKLAND HEDGE</text>
      <text x="229" y="266" class="place-label">BONFIRE GLADE</text>
      <text x="427" y="356" class="forest-label" transform="rotate(-12 427 356)">OLD MAN WILLOW</text>
      <text x="610" y="476" class="place-label">TOM BOMBADIL'S HOUSE</text>
      <text x="708" y="255" class="region-label" transform="rotate(9 708 255)">BARROW-DOWNS</text>
      <text x="721" y="507" class="small-label">the East Road</text>
      <text x="275" y="534" class="small-label">the path turns south toward the Withywindle</text>
      <text x="587" y="416" class="water-label" transform="rotate(-37 587 416)">WITHYWINDLE</text>
      <g class="regional-cartouche"><path d="M62 530H296V581H62Z" fill="#ead39e" fill-opacity=".86" stroke="#6b4930" stroke-width="1.7"></path><text x="78" y="554" class="cartouche-title">THE OLD FOREST</text><text x="78" y="571" class="cartouche-note">the trees bend the road toward the river</text></g>
    `),

    "bree-weather": plate("BREE-LAND", "the East Road · Bree Hill · the Weather Hills", "Map of Bree, the East Road, Midgewater, Weathertop, and the Weather Hills", `
      <path d="M77 348C175 327 286 338 378 351C489 365 600 346 703 354C786 361 873 342 925 351" fill="none" stroke="#a67e4e" stroke-width="22" opacity=".24"></path>
      <path d="M77 348C175 327 286 338 378 351C489 365 600 346 703 354C786 361 873 342 925 351" fill="none" stroke="#704d34" stroke-width="3.2" stroke-linecap="round"></path>
      <path d="M274 114C319 139 355 174 381 215C403 252 427 293 445 331" fill="none" stroke="#7d6243" stroke-width="2.5" stroke-dasharray="1 8" stroke-linecap="round"></path>
      <path d="M470 97C517 116 552 153 577 202C600 247 636 281 702 308" fill="none" stroke="#7d6243" stroke-width="2.3" stroke-dasharray="1 8" stroke-linecap="round"></path>
      <path d="M582 108C623 93 674 105 699 141C727 118 781 124 805 163C849 151 894 183 888 223C923 254 905 308 862 319C862 363 816 397 774 386C733 414 672 395 664 350C620 345 592 309 606 272C567 239 559 157 582 108Z" fill="#8b8662" opacity=".18" stroke="#786247" stroke-width="1.6"></path>
      <use href="#regionalMountain" transform="translate(596 118) scale(.9)"></use><use href="#regionalMountain" transform="translate(684 96) scale(1.04)"></use><use href="#regionalMountain" transform="translate(783 115) scale(.8)"></use><use href="#regionalMountain" transform="translate(844 169) scale(.65)"></use>
      <path d="M71 465C116 431 173 438 218 466C251 487 304 480 345 452C387 424 438 433 480 467C521 501 579 495 622 461C671 422 722 430 765 463C809 497 867 489 918 459" fill="none" stroke="#71816a" stroke-width="14" opacity=".23"></path>
      <path d="M72 470C116 439 171 444 214 472C250 496 300 489 343 461C387 432 436 440 478 475C522 510 578 503 622 469C669 433 720 439 762 474C808 511 865 501 919 470" fill="none" stroke="#8f8660" stroke-width="1.5" stroke-dasharray="4 8"></path>
      <path d="M721 181L761 136L800 181L790 184L781 170L773 185L760 163L750 185L741 171L732 187Z" fill="#68503a" opacity=".72"></path>
      <path d="M718 180L761 136L801 180" fill="none" stroke="#4f3b2c" stroke-width="2"></path>
      <circle cx="760" cy="145" r="6" fill="#e4c487" stroke="#60432e" stroke-width="2"></circle>
      <path d="M315 302C310 277 324 249 354 233C382 218 410 224 429 247C444 265 447 291 435 310C416 330 354 334 315 302Z" fill="#9c875e" opacity=".3" stroke="#6b5038" stroke-width="2"></path>
      <path d="M333 286C353 266 383 263 409 280C416 285 422 292 427 299" fill="none" stroke="#785b3e" stroke-width="2"></path>
      <use href="#regionalMarker" transform="translate(384 300)"></use><use href="#regionalMarker" transform="translate(760 146)"></use><use href="#regionalMarker" transform="translate(531 351)"></use>
      <text x="321" y="344" class="place-label">BREE</text><text x="312" y="363" class="small-label">the Prancing Pony</text>
      <text x="729" y="123" class="place-label">WEATHERTOP</text><text x="734" y="105" class="small-label">AMON SÛL</text>
      <text x="511" y="337" class="small-label">THE FORSAKEN INN</text>
      <text x="610" y="215" class="region-label" transform="rotate(18 610 215)">WEATHER HILLS</text>
      <text x="145" y="449" class="region-label" transform="rotate(-8 145 449)">MIDGEWATER</text>
      <text x="73" y="333" class="place-label">EAST ROAD</text><text x="837" y="337" class="place-label">EAST ROAD</text>
      <text x="444" y="397" class="small-label" transform="rotate(3 444 397)">the road east from Bree</text>
      <g class="regional-cartouche"><path d="M63 529H292V581H63Z" fill="#ead39e" fill-opacity=".86" stroke="#6b4930" stroke-width="1.7"></path><text x="79" y="553" class="cartouche-title">BREE-LAND</text><text x="79" y="570" class="cartouche-note">the last settled country west of the hills</text></g>
    `),

    "trollshaws": plate("THE TROLLSHAWS", "the Last Bridge · Rivendell · the Ford of Bruinen", "Map of the East Road from the Last Bridge through the Trollshaws to Rivendell and the Ford of Bruinen", `
      <path d="M155 89C199 115 214 158 207 204C201 255 222 299 206 345C190 391 202 458 182 535" fill="none" stroke="#78918a" stroke-width="16" opacity=".52"></path>
      <path d="M155 89C199 115 214 158 207 204C201 255 222 299 206 345C190 391 202 458 182 535" fill="none" stroke="#5f786f" stroke-width="2.3"></path>
      <path d="M712 93C681 145 688 188 718 231C738 260 731 301 712 336C691 374 700 421 733 503" fill="none" stroke="#88a096" stroke-width="18" opacity=".54"></path>
      <path d="M712 93C681 145 688 188 718 231C738 260 731 301 712 336C691 374 700 421 733 503" fill="none" stroke="#647d73" stroke-width="2.4"></path>
      <path d="M220 135C267 103 322 113 349 151C392 121 454 137 468 187C518 164 578 197 572 247C615 277 595 335 552 347C563 395 528 445 480 442C449 485 385 477 366 433C314 447 263 416 267 371C220 351 201 298 227 261C193 220 193 171 220 135Z" fill="#596044" opacity=".23" stroke="#4b513b" stroke-width="1.8"></path>
      <use href="#regionalForest" transform="translate(238 144) scale(.87)"></use><use href="#regionalForest" transform="translate(331 169) scale(.76)"></use><use href="#regionalForest" transform="translate(429 146) scale(.9)"></use><use href="#regionalForest" transform="translate(278 256) scale(.94)"></use><use href="#regionalForest" transform="translate(391 278) scale(.9)"></use><use href="#regionalForest" transform="translate(476 332) scale(.73)"></use><use href="#regionalForest" transform="translate(323 373) scale(.72)"></use>
      <use href="#regionalMountain" transform="translate(770 112) scale(.95)"></use><use href="#regionalMountain" transform="translate(850 93) scale(.78)"></use><use href="#regionalMountain" transform="translate(796 203) scale(.6)"></use>
      <path d="M66 369C142 349 185 337 213 315C261 277 291 235 333 220C399 196 462 210 511 251C550 284 573 307 622 326C657 339 681 358 711 379" fill="none" stroke="#8d6a45" stroke-width="18" opacity=".34"></path>
      <path d="M66 369C142 349 185 337 213 315C261 277 291 235 333 220C399 196 462 210 511 251C550 284 573 307 622 326C657 339 681 358 711 379" fill="none" stroke="#65472f" stroke-width="3" stroke-linecap="round"></path>
      <path d="M218 315C261 278 296 235 333 220C401 196 464 209 512 250C552 284 574 307 622 326C659 340 682 358 711 379" fill="none" stroke="#65472f" stroke-width="2.2" stroke-dasharray="1 8" stroke-linecap="round"></path>
      <path d="M620 326C604 300 597 277 610 249C625 221 657 206 688 215" fill="none" stroke="#65472f" stroke-width="2.4" stroke-dasharray="1 8" stroke-linecap="round"></path>
      <path d="M690 205C716 195 744 204 758 229C771 250 771 278 759 299C745 321 727 334 704 340" fill="#8b7550" opacity=".23" stroke="#65472f" stroke-width="2"></path>
      <use href="#regionalMarker" transform="translate(216 315)"></use><use href="#regionalMarker" transform="translate(704 340)"></use><use href="#regionalMarker" transform="translate(713 379)"></use><use href="#regionalMarker" transform="translate(622 326)"></use>
      <text x="86" y="354" class="water-label" transform="rotate(-18 86 354)">HOARWELL / MITHEITHEL</text>
      <text x="174" y="304" class="place-label">LAST BRIDGE</text>
      <text x="685" y="194" class="place-label">RIVENDELL</text><text x="680" y="177" class="small-label">the hidden valley</text>
      <text x="725" y="368" class="place-label">FORD OF BRUINEN</text>
      <text x="289" y="170" class="region-label" transform="rotate(-10 289 170)">TROLLSHAWS</text>
      <text x="834" y="253" class="region-label" transform="rotate(12 834 253)">MISTY MOUNTAINS</text>
      <text x="451" y="291" class="small-label" transform="rotate(17 451 291)">the East Road</text>
      <text x="570" y="238" class="small-label" transform="rotate(-23 570 238)">the road loops south</text>
      <g class="regional-cartouche"><path d="M62 529H323V581H62Z" fill="#ead39e" fill-opacity=".86" stroke="#6b4930" stroke-width="1.7"></path><text x="78" y="553" class="cartouche-title">THE TROLLSHAWS</text><text x="78" y="570" class="cartouche-note">wooded hills before the hidden house</text></g>
    `),

    "moria": plate("THE REDHORN PASS", "Eregion · Moria · the Dimrill Dale", "Map of Hollin, the Redhorn Pass, the Doors of Durin, Moria, and Dimrill Dale", `
      <path d="M61 430C139 401 212 418 273 449C329 477 386 474 441 442C507 403 556 402 620 430C701 465 789 460 902 422V594H61Z" fill="#b49c6b" opacity=".2"></path>
      <g transform="translate(0 54)">
        <path d="M74 186L143 83L199 185L266 63L330 184L393 54L456 184L526 78L584 190L642 91L703 191" fill="#715438" opacity=".32" stroke="#513a2b" stroke-width="3" stroke-linejoin="round"></path>
        <path d="M75 186L143 83L199 185M266 63L330 184M393 54L456 184M526 78L584 190M642 91L703 191" fill="none" stroke="#5b422e" stroke-width="2"></path>
        <path d="M91 188L143 111L181 181M285 174L330 98L366 175M414 172L456 92L492 174M548 177L584 119L620 180" fill="none" stroke="#b08a5c" stroke-width="1.8"></path>
      </g>
      <path d="M62 315C160 295 233 306 308 337C372 363 417 378 476 355C539 331 595 292 668 302C746 312 820 351 900 328" fill="none" stroke="#7b6a56" stroke-width="3" stroke-dasharray="4 8"></path>
      <path d="M313 351C344 326 378 315 413 325C444 335 454 362 445 392C431 421 375 431 336 412C305 398 295 374 313 351Z" fill="#322b27" opacity=".88" stroke="#4b362a" stroke-width="3"></path>
      <path d="M340 350C370 337 403 341 422 361M335 374C365 363 400 366 424 385M349 399C374 392 396 395 414 404" fill="none" stroke="#7a6952" stroke-width="2" opacity=".68"></path>
      <path d="M106 453C196 430 252 421 315 401C379 381 427 368 477 355" fill="none" stroke="#8a6947" stroke-width="17" opacity=".36"></path>
      <path d="M106 453C196 430 252 421 315 401C379 381 427 368 477 355" fill="none" stroke="#60432f" stroke-width="2.8" stroke-dasharray="2 8" stroke-linecap="round"></path>
      <path d="M476 355C529 342 584 323 632 340C684 359 710 402 746 445" fill="none" stroke="#60432f" stroke-width="2.6" stroke-dasharray="2 8" stroke-linecap="round"></path>
      <path d="M741 444C774 425 814 431 838 457C856 477 852 510 832 528C805 550 761 542 742 515C725 491 722 460 741 444Z" fill="#a7a27b" opacity=".31" stroke="#5f513d" stroke-width="2"></path>
      <path d="M767 470C787 453 814 458 828 477C838 491 835 509 825 520" fill="none" stroke="#6b694f" stroke-width="2"></path>
      <use href="#regionalMarker" transform="translate(106 453)"></use><use href="#regionalMarker" transform="translate(315 401)"></use><use href="#regionalMarker" transform="translate(632 340)"></use><use href="#regionalMarker" transform="translate(746 445)"></use>
      <text x="85" y="421" class="region-label" transform="rotate(-10 85 421)">HOLLIN / EREGION</text>
      <text x="282" y="308" class="place-label">DOORS OF DURIN</text><text x="304" y="326" class="small-label">the West-gate</text>
      <text x="354" y="457" class="place-label">MORIA</text><text x="348" y="474" class="small-label">Khazad-dûm</text>
      <text x="736" y="154" class="place-label">REDHORN PASS</text><text x="731" y="171" class="small-label">Caradhras · Silvertine · Cloudyhead</text>
      <text x="536" y="333" class="place-label">BRIDGE OF KHAZAD-DÛM</text>
      <text x="746" y="429" class="place-label">DIMRILL DALE</text><text x="765" y="548" class="small-label">MIRRORMERE · SILVERLODE</text>
      <text x="693" y="273" class="small-label" transform="rotate(22 693 273)">the Dimrill Stair</text>
      <text x="79" y="466" class="place-label">RIVENDELL</text><text x="79" y="484" class="small-label">the road from Imladris</text>
      <text x="85" y="509" class="small-label">the Fellowship enters the mountains</text>
      <g class="regional-cartouche"><path d="M62 529H300V581H62Z" fill="#ead39e" fill-opacity=".86" stroke="#6b4930" stroke-width="1.7"></path><text x="78" y="553" class="cartouche-title">MORIA</text><text x="78" y="570" class="cartouche-note">the road beneath the mountains</text></g>
    `),

    "lothlorien": plate("LOTHLÓRIEN", "the Golden Wood · Nimrodel · Anduin", "Map of Lothlorien between the Misty Mountains and the Anduin, with Caras Galadhon and Nimrodel", `
      <path d="M145 95C209 78 278 102 305 157C355 119 425 127 450 179C497 151 568 170 580 229C642 217 702 255 698 317C748 351 726 423 673 439C663 499 598 534 548 503C501 547 425 531 406 480C344 500 283 466 286 407C229 390 205 340 225 293C177 261 121 177 145 95Z" fill="#8b8f55" opacity=".22" stroke="#636c46" stroke-width="2"></path>
      <use href="#regionalTree" transform="translate(167 130) scale(.88)"></use><use href="#regionalTree" transform="translate(242 117) scale(1.02)"></use><use href="#regionalTree" transform="translate(330 155) scale(.9)"></use><use href="#regionalTree" transform="translate(423 142) scale(1.05)"></use><use href="#regionalTree" transform="translate(519 179) scale(.88)"></use><use href="#regionalTree" transform="translate(214 251) scale(.82)"></use><use href="#regionalTree" transform="translate(320 267) scale(1.02)"></use><use href="#regionalTree" transform="translate(449 294) scale(.88)"></use><use href="#regionalTree" transform="translate(559 319) scale(.98)"></use><use href="#regionalTree" transform="translate(270 388) scale(.86)"></use><use href="#regionalTree" transform="translate(423 407) scale(.9)"></use><use href="#regionalTree" transform="translate(563 423) scale(.78)"></use>
      <path d="M783 74C749 130 772 184 752 237C733 289 767 336 746 392C730 436 752 489 744 554" fill="none" stroke="#8aa194" stroke-width="23" opacity=".56"></path>
      <path d="M783 74C749 130 772 184 752 237C733 289 767 336 746 392C730 436 752 489 744 554" fill="none" stroke="#5f796e" stroke-width="2.8"></path>
      <path d="M271 105C293 164 326 219 361 271C392 316 427 361 466 400" fill="none" stroke="#9eaf8a" stroke-width="15" opacity=".62"></path>
      <path d="M271 105C293 164 326 219 361 271C392 316 427 361 466 400" fill="none" stroke="#71835e" stroke-width="2.3"></path>
      <path d="M444 282C480 274 522 285 552 314C583 345 600 383 611 425" fill="none" stroke="#927a53" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"></path>
      <path d="M333 206C352 185 380 181 402 194C421 206 430 230 423 250C412 273 376 281 348 267C324 255 316 229 333 206Z" fill="#c2ad6b" opacity=".37" stroke="#79603f" stroke-width="2"></path>
      <path d="M344 211C363 198 388 198 405 210M342 230C361 221 387 220 408 231M349 248C368 241 389 242 402 249" fill="none" stroke="#806346" stroke-width="1.4"></path>
      <use href="#regionalMarker" transform="translate(444 282)"></use><use href="#regionalMarker" transform="translate(610 425)"></use><use href="#regionalMarker" transform="translate(743 470)"></use>
      <text x="124" y="122" class="region-label" transform="rotate(-12 124 122)">MISTY MOUNTAINS</text>
      <text x="335" y="189" class="place-label">CARAS GALADHON</text><text x="346" y="174" class="small-label">the city of the trees</text>
      <text x="354" y="303" class="place-label">CERIN AMROTH</text>
      <text x="289" y="137" class="water-label" transform="rotate(61 289 137)">NIMRODEL</text>
      <text x="786" y="283" class="water-label" transform="rotate(83 786 283)">ANDUIN</text>
      <text x="631" y="455" class="small-label" transform="rotate(14 631 455)">the river stairs</text>
      <text x="690" y="573" class="place-label">BOAT-LANDING</text>
      <text x="162" y="493" class="small-label">the Golden Wood</text>
      <g class="regional-cartouche"><path d="M62 529H330V581H62Z" fill="#ead39e" fill-opacity=".86" stroke="#6b4930" stroke-width="1.7"></path><text x="78" y="553" class="cartouche-title">LOTHLÓRIEN</text><text x="78" y="570" class="cartouche-note">the Fellowship rests beneath golden boughs</text></g>
    `),

    "anduin": plate("THE GREAT RIVER", "Sarn Gebir · Nen Hithoel · Rauros", "Map of the Anduin from Sarn Gebir through Nen Hithoel to Rauros, Amon Hen, and Parth Galen", `
      <path d="M427 70C467 110 454 158 480 202C509 253 487 302 514 345C548 398 516 441 535 492C550 535 537 572 562 604" fill="none" stroke="#76928e" stroke-width="66" opacity=".32"></path>
      <path d="M427 70C467 110 454 158 480 202C509 253 487 302 514 345C548 398 516 441 535 492C550 535 537 572 562 604" fill="none" stroke="#5f807c" stroke-width="3.4"></path>
      <path d="M429 75C451 111 443 143 458 177M473 213C493 243 479 272 497 302M517 367C535 394 519 421 531 449M540 508C549 532 543 553 552 578" fill="none" stroke="#a4c0ae" stroke-width="2" stroke-dasharray="9 14" opacity=".8"></path>
      <path d="M250 96C219 150 235 200 267 242C301 286 294 324 268 367C239 416 243 489 216 548" fill="none" stroke="#6a5a48" stroke-width="17" opacity=".24"></path>
      <path d="M251 96C219 150 235 200 267 242C301 286 294 324 268 367C239 416 243 489 216 548" fill="none" stroke="#8a7455" stroke-width="2" opacity=".6"></path>
      <path d="M667 92C714 137 720 187 690 231C659 274 669 326 716 361C757 391 766 442 736 482C715 513 709 546 728 579" fill="none" stroke="#8a7455" stroke-width="15" opacity=".26"></path>
      <path d="M667 92C714 137 720 187 690 231C659 274 669 326 716 361C757 391 766 442 736 482C715 513 709 546 728 579" fill="none" stroke="#806b4f" stroke-width="2" opacity=".62"></path>
      <path d="M392 264L418 203L444 264Z M535 264L561 203L587 264Z" fill="#554337" opacity=".75" stroke="#433327" stroke-width="2"></path>
      <path d="M388 260L418 215L448 260M531 260L561 215L591 260" fill="none" stroke="#d0b781" stroke-width="1.7"></path>
      <ellipse cx="520" cy="429" rx="123" ry="135" fill="#9c9b78" opacity=".23" stroke="#71634e" stroke-width="2.2"></ellipse>
      <path d="M422 386C470 355 527 362 577 392C622 420 627 485 585 517C540 550 471 546 431 507C399 477 395 419 422 386Z" fill="#9d9b76" opacity=".26" stroke="#71634e" stroke-width="1.5"></path>
      <path d="M486 401C514 386 546 393 563 415L574 490C548 512 517 515 490 500L477 429Z" fill="#66594a" opacity=".75" stroke="#514235" stroke-width="2"></path>
      <path d="M496 402L510 371L527 402L542 375L558 414" fill="none" stroke="#5c4c3c" stroke-width="2.2"></path>
      <path d="M285 488C322 455 368 449 403 470C423 482 432 505 428 529C399 548 354 550 318 534C296 524 282 507 285 488Z" fill="#76834f" opacity=".5" stroke="#596040" stroke-width="2"></path>
      <path d="M615 484C647 458 691 462 716 486C737 506 737 535 718 555C687 568 644 559 624 536C613 521 609 500 615 484Z" fill="#7a7451" opacity=".45" stroke="#5b513d" stroke-width="2"></path>
      <path d="M291 188L279 212L303 212Z M312 188L300 212L324 212Z M333 188L321 212L345 212Z" fill="#7c674b" opacity=".7"></path>
      <use href="#regionalMarker" transform="translate(433 315)"></use><use href="#regionalMarker" transform="translate(428 514)"></use><use href="#regionalMarker" transform="translate(474 545)"></use>
      <text x="560" y="118" class="water-label" transform="rotate(78 560 118)">ANDUIN</text>
      <text x="334" y="179" class="place-label">SARN GEBIR</text><text x="326" y="197" class="small-label">the rapids</text>
      <text x="344" y="286" class="place-label">ARGONATH</text><text x="345" y="303" class="small-label">the Pillars of the Kings</text>
      <text x="463" y="444" class="region-label" transform="rotate(-7 463 444)">NEN HITHOEL</text>
      <text x="484" y="392" class="place-label">TOL BRANDIR</text>
      <text x="288" y="474" class="place-label">AMON HEN</text><text x="291" y="492" class="small-label">the Hill of Seeing</text>
      <text x="618" y="473" class="place-label">AMON LHAW</text>
      <text x="291" y="541" class="place-label">PARTH GALEN</text>
      <text x="470" y="569" class="place-label">RAUROS</text><text x="475" y="588" class="small-label">the great falls</text>
      <text x="764" y="554" class="small-label" transform="rotate(-17 764 554)">Emyn Muil</text>
      <g class="regional-cartouche"><path d="M62 529H294V581H62Z" fill="#ead39e" fill-opacity=".86" stroke="#6b4930" stroke-width="1.7"></path><text x="78" y="553" class="cartouche-title">NEN HITHOEL</text><text x="78" y="570" class="cartouche-note">the river narrows, then breaks apart</text></g>
    `),

    "rohan": plate("ROHAN & FANGORN", "Emyn Muil · Eastemnet · Westfold", "Map of Rohan from Emyn Muil and Fangorn to Edoras, Helm's Deep, and Isengard", `
      <path d="M58 150C159 116 287 123 382 167C480 213 587 174 681 208C778 243 861 324 897 427C820 494 704 520 574 494C431 523 282 496 137 516C82 443 56 303 58 150Z" fill="#9ca873" opacity=".2" stroke="#6b774e" stroke-width="2"></path>
      <path d="M56 116L110 73L167 114L224 67L283 116L336 79L390 119" fill="#76583e" opacity=".26" stroke="#59402e" stroke-width="2.6" stroke-linejoin="round"></path>
      <path d="M61 118L110 83L156 115M181 115L224 78L264 116M298 117L336 90L370 118" fill="none" stroke="#60432f" stroke-width="1.8"></path>
      <use href="#regionalMountain" transform="translate(73 98) scale(.62)"></use><use href="#regionalMountain" transform="translate(177 95) scale(.58)"></use><use href="#regionalMountain" transform="translate(290 98) scale(.55)"></use>
      <path d="M72 500C177 471 272 492 355 514C466 543 588 515 690 527C777 538 854 523 918 501" fill="none" stroke="#76553c" stroke-width="28" opacity=".24"></path>
      <path d="M70 500C178 471 270 493 355 515C466 544 587 516 690 528C777 539 853 524 918 502" fill="none" stroke="#664831" stroke-width="2.5"></path>
      <path d="M791 92C770 141 792 194 771 242C749 291 773 342 757 392C744 433 763 472 752 531" fill="none" stroke="#71908a" stroke-width="22" opacity=".45"></path>
      <path d="M791 92C770 141 792 194 771 242C749 291 773 342 757 392C744 433 763 472 752 531" fill="none" stroke="#59766e" stroke-width="2.5"></path>
      <path d="M530 284C602 284 646 310 694 348C725 373 745 392 770 402" fill="none" stroke="#8a9b79" stroke-width="18" opacity=".48"></path>
      <path d="M530 284C602 284 646 310 694 348C725 373 745 392 770 402" fill="none" stroke="#657557" stroke-width="2.2"></path>
      <path d="M257 312C229 348 228 392 258 428C287 463 333 471 369 450C398 432 414 389 394 353C374 319 295 287 257 312Z" fill="#526247" opacity=".34" stroke="#43513c" stroke-width="2"></path>
      <use href="#regionalForest" transform="translate(247 304) scale(.72)"></use><use href="#regionalForest" transform="translate(318 300) scale(.66)"></use><use href="#regionalForest" transform="translate(379 328) scale(.76)"></use><use href="#regionalForest" transform="translate(275 387) scale(.7)"></use><use href="#regionalForest" transform="translate(350 403) scale(.62)"></use>
      <text x="291" y="276" class="region-label" transform="rotate(-8 291 276)">FANGORN</text>
      <path d="M728 123C769 107 832 119 872 151C899 173 911 224 894 259C877 292 829 297 786 286C753 276 728 243 716 208C705 173 707 141 728 123Z" fill="#8b8662" opacity=".2" stroke="#756047" stroke-width="1.8"></path>
      <use href="#regionalMound" transform="translate(758 156) scale(.84)"></use><use href="#regionalMound" transform="translate(825 190) scale(.7)"></use><use href="#regionalMound" transform="translate(760 237) scale(.62)"></use>
      <text x="766" y="290" class="region-label" transform="rotate(12 766 290)">EMYN MUIL</text>
      <path d="M174 226C219 213 263 220 305 241C344 261 377 287 414 299C450 310 480 302 514 284" fill="none" stroke="#8c6b47" stroke-width="15" opacity=".34"></path>
      <path d="M174 226C219 213 263 220 305 241C344 261 377 287 414 299C450 310 480 302 514 284" fill="none" stroke="#61432f" stroke-width="2.7" stroke-dasharray="2 8" stroke-linecap="round"></path>
      <path d="M513 284C556 300 586 332 604 370C622 405 620 438 642 470" fill="none" stroke="#8c6b47" stroke-width="14" opacity=".3"></path>
      <path d="M513 284C556 300 586 332 604 370C622 405 620 438 642 470" fill="none" stroke="#61432f" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"></path>
      <path d="M196 390C211 369 234 361 258 368C278 374 292 393 288 414C283 436 262 448 237 444C213 441 190 418 196 390Z" fill="#85704c" opacity=".28" stroke="#614631" stroke-width="2"></path>
      <path d="M188 375C207 354 237 347 265 355C289 363 302 384 300 405" fill="none" stroke="#63452f" stroke-width="3" stroke-dasharray="2 8"></path>
      <path d="M407 420C431 400 468 397 495 412C516 424 528 449 518 471C506 491 469 501 437 489C410 479 394 444 407 420Z" fill="#8d7955" opacity=".25" stroke="#63452f" stroke-width="2"></path>
      <path d="M431 420L461 386L491 420L484 422L476 410L468 423L460 401L452 423L443 410L436 424Z" fill="#60432f" opacity=".7"></path>
      <circle cx="461" cy="407" r="5" fill="#e5c784" stroke="#60432f" stroke-width="2"></circle>
      <text x="130" y="353" class="place-label">ISENGARD</text><text x="128" y="371" class="small-label">the Ring of stone</text>
      <text x="430" y="509" class="place-label">EDORAS</text><text x="432" y="526" class="small-label">MEDUSELD · the Golden Hall</text>
      <text x="103" y="459" class="place-label">HELM'S DEEP</text><text x="111" y="477" class="small-label">the Hornburg</text>
      <text x="501" y="259" class="place-label">EASTEMNET</text><text x="622" y="319" class="small-label" transform="rotate(22 622 319)">ENTWASH</text>
      <text x="690" y="142" class="place-label">PARTH GALEN</text><text x="694" y="159" class="small-label">the western lawn</text>
      <text x="775" y="119" class="water-label" transform="rotate(84 775 119)">ANDUIN</text>
      <text x="87" y="104" class="region-label" transform="rotate(-8 87 104)">MISTY MOUNTAINS</text>
      <text x="381" y="585" class="region-label" transform="rotate(4 381 585)">WHITE MOUNTAINS</text>
      <use href="#regionalMarker" transform="translate(788 132)"></use><use href="#regionalMarker" transform="translate(752 236)"></use><use href="#regionalMarker" transform="translate(513 284)"></use><use href="#regionalMarker" transform="translate(461 407)"></use><use href="#regionalMarker" transform="translate(229 407)"></use><use href="#regionalMarker" transform="translate(160 347)"></use>
      <g class="regional-cartouche"><path d="M62 529H322V581H62Z" fill="#ead39e" fill-opacity=".86" stroke="#6b4930" stroke-width="1.7"></path><text x="78" y="553" class="cartouche-title">ROHAN &amp; FANGORN</text><text x="78" y="570" class="cartouche-note">the horse-country beneath the old forest</text></g>
    `),

    "mordor": plate("ITHILIEN & MORDOR", "Emyn Muil · the Dead Marshes · Cirith Ungol", "Map of Emyn Muil, the Dead Marshes, Ithilien, the Black Gate, Morgul Vale, and Cirith Ungol", `
      <path d="M70 134C156 106 240 119 312 156C376 189 435 202 509 179C591 153 695 113 813 127C884 136 920 188 906 255C890 329 918 414 876 496C811 540 700 532 608 511C497 537 377 505 276 527C177 508 87 466 67 392C47 313 50 197 70 134Z" fill="#8c8662" opacity=".17" stroke="#6f5a43" stroke-width="2"></path>
      <path d="M423 92L458 67L492 94L529 61L566 94L604 68L642 97L684 63L723 97L761 72L799 103L841 77L885 111" fill="#4d3b30" opacity=".45" stroke="#392c26" stroke-width="2.8" stroke-linejoin="round"></path>
      <path d="M429 94L458 76L484 94M500 94L529 70L555 94M578 95L604 77L630 96M653 98L684 74L710 97M733 99L761 83L787 103M812 104L841 87L872 111" fill="none" stroke="#b49362" stroke-width="1.6"></path>
      <text x="664" y="120" class="region-label" transform="rotate(5 664 120)">ERED LITHUI</text>
      <path d="M120 104C105 160 126 210 109 266C95 314 116 367 105 429C97 475 109 518 98 566" fill="none" stroke="#6f8d82" stroke-width="20" opacity=".42"></path>
      <path d="M120 104C105 160 126 210 109 266C95 314 116 367 105 429C97 475 109 518 98 566" fill="none" stroke="#55746c" stroke-width="2.5"></path>
      <text x="91" y="266" class="water-label" transform="rotate(84 91 266)">ANDUIN</text>
      <path d="M182 135C232 110 295 120 331 160C368 201 362 250 332 281C302 311 238 310 199 278C162 247 145 167 182 135Z" fill="#777451" opacity=".34" stroke="#5b583e" stroke-width="2"></path>
      <use href="#regionalMound" transform="translate(180 167) scale(.86)"></use><use href="#regionalMound" transform="translate(248 142) scale(.78)"></use><use href="#regionalMound" transform="translate(283 220) scale(.7)"></use><use href="#regionalMound" transform="translate(196 246) scale(.62)"></use>
      <text x="185" y="130" class="region-label" transform="rotate(-11 185 130)">EMYN MUIL</text>
      <path d="M283 266C309 250 345 253 371 273C395 291 407 322 395 348C379 377 337 385 305 368C278 354 265 294 283 266Z" fill="#757a55" opacity=".29" stroke="#5c6347" stroke-width="2"></path>
      <ellipse cx="306" cy="303" rx="18" ry="10" fill="#787b65" opacity=".7"></ellipse><ellipse cx="344" cy="286" rx="14" ry="8" fill="#777a64" opacity=".68"></ellipse><ellipse cx="360" cy="331" rx="21" ry="11" fill="#70755c" opacity=".72"></ellipse><ellipse cx="319" cy="349" rx="12" ry="7" fill="#777a64" opacity=".68"></ellipse>
      <path d="M309 369C340 393 378 402 419 397C463 391 508 374 548 351" fill="none" stroke="#7e765b" stroke-width="3" stroke-dasharray="4 9"></path>
      <text x="277" y="391" class="region-label" transform="rotate(8 277 391)">DEAD MARSHES</text>
      <path d="M548 140C595 121 650 132 676 173C701 213 682 251 650 274C625 292 590 285 565 262C536 235 525 166 548 140Z" fill="#7a774f" opacity=".24" stroke="#625438" stroke-width="2"></path>
      <path d="M549 246L606 259L664 246" fill="none" stroke="#46372d" stroke-width="10" opacity=".8"></path><path d="M548 247L606 260L664 247" fill="none" stroke="#a0865c" stroke-width="2" stroke-dasharray="3 6"></path>
      <path d="M548 211L557 161L568 211M648 211L659 161L670 211" fill="#44342b" stroke="#362920" stroke-width="2"></path>
      <text x="561" y="303" class="place-label">BLACK GATE</text><text x="558" y="321" class="small-label">the Morannon · Udûn</text>
      <path d="M377 404C407 362 456 342 505 351C555 361 590 397 608 442C623 480 596 518 551 526C494 537 430 515 395 484C370 462 359 430 377 404Z" fill="#658252" opacity=".34" stroke="#526b45" stroke-width="2"></path>
      <use href="#regionalForest" transform="translate(395 389) scale(.63)"></use><use href="#regionalForest" transform="translate(467 377) scale(.72)"></use><use href="#regionalForest" transform="translate(528 404) scale(.62)"></use><use href="#regionalForest" transform="translate(422 456) scale(.6)"></use><use href="#regionalForest" transform="translate(510 467) scale(.66)"></use>
      <text x="409" y="530" class="region-label" transform="rotate(-5 409 530)">ITHILIEN</text>
      <path d="M373 419C431 414 482 412 529 406C578 399 621 382 663 359C701 338 730 307 754 280" fill="none" stroke="#8a6845" stroke-width="15" opacity=".32"></path>
      <path d="M373 419C431 414 482 412 529 406C578 399 621 382 663 359C701 338 730 307 754 280" fill="none" stroke="#5f432f" stroke-width="2.6" stroke-dasharray="2 8" stroke-linecap="round"></path>
      <path d="M639 285C668 257 718 246 757 264C790 280 802 316 789 350C773 391 720 408 679 389C642 371 615 319 639 285Z" fill="#514236" opacity=".46" stroke="#403329" stroke-width="2"></path>
      <path d="M694 293L713 268L732 293L725 295L720 286L714 297L709 285L704 297Z" fill="#a99b76" opacity=".72" stroke="#403329" stroke-width="1.5"></path>
      <path d="M758 357C781 330 818 319 851 334C878 348 890 379 878 408C861 447 815 466 779 447C749 432 738 387 758 357Z" fill="#5d4838" opacity=".28" stroke="#46362c" stroke-width="2"></path>
      <path d="M772 389C789 371 815 370 833 386C841 394 846 405 846 416" fill="none" stroke="#c0a676" stroke-width="2"></path>
      <path d="M719 437C742 421 769 425 784 445C797 463 791 491 771 503C749 516 720 504 711 481C704 462 706 447 719 437Z" fill="#3f322b" opacity=".9" stroke="#2f2722" stroke-width="2"></path>
      <path d="M724 446C742 438 762 443 774 457M720 463C741 454 762 459 778 474M723 482C744 472 760 478 772 491" fill="none" stroke="#a58c63" stroke-width="1.5" opacity=".74"></path>
      <path d="M675 510L711 464L746 510M682 503L711 476L736 507" fill="none" stroke="#46352b" stroke-width="2.5"></path>
      <text x="661" y="426" class="place-label">MORGUL VALE</text><text x="659" y="444" class="small-label">MINAS MORGUL · the white bridge</text>
      <text x="714" y="529" class="place-label">CIRITH UNGOL</text><text x="717" y="547" class="small-label">SHELOB'S LAIR · the high pass</text>
      <text x="789" y="495" class="place-label">TOWER</text>
      <text x="458" y="385" class="place-label">HENNETH ANNÛN</text><text x="458" y="402" class="small-label">the Window on the West</text>
      <text x="486" y="444" class="place-label">CROSS-ROADS</text>
      <text x="744" y="174" class="region-label" transform="rotate(76 744 174)">EPHEL DÚATH</text>
      <use href="#regionalMarker" transform="translate(184 241)"></use><use href="#regionalMarker" transform="translate(328 319)"></use><use href="#regionalMarker" transform="translate(608 255)"></use><use href="#regionalMarker" transform="translate(462 407)"></use><use href="#regionalMarker" transform="translate(713 361)"></use><use href="#regionalMarker" transform="translate(744 445)"></use><use href="#regionalMarker" transform="translate(778 484)"></use>
      <g class="regional-cartouche"><path d="M62 529H338V581H62Z" fill="#ead39e" fill-opacity=".86" stroke="#6b4930" stroke-width="1.7"></path><text x="78" y="553" class="cartouche-title">ITHILIEN &amp; MORDOR</text><text x="78" y="570" class="cartouche-note">the green land under the shadow wall</text></g>
    `),

    "gondor": plate("GONDOR", "Dunharrow · Minas Tirith · the Pelennor Fields", "Map of Gondor from Dunharrow and the White Mountains to Minas Tirith, Osgiliath, Pelargir, and Ithilien", `
      <path d="M64 128C157 102 258 116 347 137C451 162 544 135 634 149C742 166 849 142 914 205C897 285 926 361 896 430C867 504 775 538 679 526C580 557 467 537 371 561C272 548 172 527 99 478C63 408 51 304 64 128Z" fill="#a5ae7e" opacity=".22" stroke="#697b54" stroke-width="2"></path>
      <path d="M61 507C142 478 216 487 281 508C351 530 422 521 491 502C568 480 645 487 719 507C796 528 858 515 917 493" fill="none" stroke="#66523d" stroke-width="36" opacity=".22"></path>
      <path d="M61 507C142 478 216 487 281 508C351 530 422 521 491 502C568 480 645 487 719 507C796 528 858 515 917 493" fill="none" stroke="#5a4634" stroke-width="2.6"></path>
      <use href="#regionalMountain" transform="translate(72 468) scale(.78)"></use><use href="#regionalMountain" transform="translate(176 474) scale(.93)"></use><use href="#regionalMountain" transform="translate(294 480) scale(.8)"></use><use href="#regionalMountain" transform="translate(404 473) scale(.88)"></use><use href="#regionalMountain" transform="translate(527 467) scale(.75)"></use><use href="#regionalMountain" transform="translate(640 473) scale(.88)"></use><use href="#regionalMountain" transform="translate(766 462) scale(.72)"></use>
      <path d="M575 93C566 144 582 188 568 232C552 282 570 325 558 369C548 414 567 461 553 548" fill="none" stroke="#6d8f84" stroke-width="25" opacity=".45"></path>
      <path d="M575 93C566 144 582 188 568 232C552 282 570 325 558 369C548 414 567 461 553 548" fill="none" stroke="#54756d" stroke-width="2.8"></path>
      <text x="599" y="313" class="water-label" transform="rotate(83 599 313)">ANDUIN</text>
      <path d="M213 173C262 165 315 179 350 208C386 238 418 254 465 253C520 252 560 236 605 253C655 273 690 303 719 342" fill="none" stroke="#8c6a44" stroke-width="14" opacity=".3"></path>
      <path d="M213 173C262 165 315 179 350 208C386 238 418 254 465 253C520 252 560 236 605 253C655 273 690 303 719 342" fill="none" stroke="#5c432f" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"></path>
      <path d="M303 472C333 446 354 424 365 399C375 377 384 358 395 334" fill="none" stroke="#5c432f" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"></path>
      <path d="M395 334C421 309 452 286 492 278C534 270 574 280 612 294C652 310 693 322 721 339" fill="none" stroke="#5c432f" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"></path>
      <path d="M397 547C421 504 436 456 436 409C436 361 425 315 406 279" fill="none" stroke="#5c432f" stroke-width="2.3" stroke-dasharray="2 8" stroke-linecap="round"></path>
      <path d="M419 193C453 161 508 161 541 192C570 219 574 263 551 290C523 322 468 323 431 299C398 278 390 220 419 193Z" fill="#526346" opacity=".35" stroke="#46533d" stroke-width="2"></path>
      <use href="#regionalForest" transform="translate(417 178) scale(.65)"></use><use href="#regionalForest" transform="translate(471 169) scale(.72)"></use><use href="#regionalForest" transform="translate(519 198) scale(.62)"></use><use href="#regionalForest" transform="translate(451 243) scale(.63)"></use>
      <text x="420" y="318" class="region-label" transform="rotate(-8 420 318)">DRÚADAN FOREST</text>
      <path d="M446 311C472 289 512 284 548 298C582 311 603 337 597 367C588 398 546 414 506 405C470 398 434 366 446 311Z" fill="#9ca873" opacity=".18" stroke="#718050" stroke-width="1.5"></path>
      <path d="M460 315L487 306L511 314L539 306L567 319L585 346L573 370L538 382L502 376L469 361Z" fill="none" stroke="#718050" stroke-width="1.5" stroke-dasharray="4 7"></path>
      <text x="459" y="351" class="region-label">PELENNOR</text><text x="473" y="369" class="small-label">farmland within the Rammas</text>
      <path d="M483 251C498 232 521 225 544 235C558 241 567 255 566 271C555 283 536 290 517 286C499 282 487 269 483 251Z" fill="#766c52" opacity=".35" stroke="#554532" stroke-width="2"></path>
      <path d="M484 263C507 257 536 257 564 264" fill="none" stroke="#cfb57b" stroke-width="2"></path><path d="M493 247C504 235 516 231 526 230M530 231C543 237 551 247 558 258" fill="none" stroke="#534032" stroke-width="1.7"></path>
      <text x="475" y="222" class="place-label">OSGILIATH</text><text x="480" y="240" class="small-label">the river-city</text>
      <g transform="translate(716 245)" filter="url(#regionalInk)">
        <path d="M-42 88L-30 58L-19 74L-8 37L4 67L17 25L28 61L43 11L54 61L67 26L79 73L91 53L102 89Z" fill="#dfd5ad" stroke="#574534" stroke-width="2.1"></path>
        <path d="M-32 71L79 71M-38 84L86 84M-18 54L66 54M-3 38L51 38M16 22L37 22" fill="none" stroke="#8f7957" stroke-width="2"></path>
        <path d="M-43 90H102V102H-43Z" fill="#44362c"></path>
        <path d="M22 13V-9M16 -1L22 -15L28 -1" fill="none" stroke="#45352b" stroke-width="3"></path>
      </g>
      <text x="713" y="366" class="place-label">MINAS TIRITH</text><text x="717" y="385" class="small-label">the White City · seven circles</text>
      <path d="M721 340C753 327 786 331 817 348C842 362 854 386 846 409C836 432 804 447 771 444C738 441 711 422 707 397C703 375 708 353 721 340Z" fill="#ede0b5" opacity=".23" stroke="#7b674a" stroke-width="1.6"></path>
      <path d="M733 359C755 349 784 351 806 363C823 373 830 389 825 403C819 417 797 426 776 424C752 422 735 410 731 396C727 382 727 368 733 359Z" fill="none" stroke="#7a674a" stroke-width="1.6" stroke-dasharray="3 7"></path>
      <text x="752" y="463" class="small-label">PELENNOR FIELDS</text>
      <path d="M266 446C284 426 310 419 333 429C351 437 361 455 358 474C347 494 320 504 295 496C273 489 259 468 266 446Z" fill="#806d50" opacity=".32" stroke="#5c4634" stroke-width="2"></path>
      <path d="M276 449L294 432L311 449L330 425L347 449M288 468L307 450L325 470" fill="none" stroke="#614530" stroke-width="2"></path>
      <text x="250" y="510" class="place-label">DUNHARROW</text><text x="250" y="528" class="small-label">the Firienfeld</text>
      <path d="M346 442L371 421L391 442L413 416L430 441" fill="none" stroke="#5a4432" stroke-width="2.8"></path><path d="M354 450L370 435L383 449M391 449L412 430L424 447" fill="none" stroke="#80664a" stroke-width="1.7"></path>
      <text x="351" y="403" class="place-label">PATHS OF THE DEAD</text><text x="354" y="421" class="small-label">through the Dwimorberg</text>
      <path d="M376 531C393 516 420 515 438 530C451 541 451 558 436 568C415 579 389 571 377 556C370 547 370 538 376 531Z" fill="#8d7a55" opacity=".3" stroke="#624a36" stroke-width="1.8"></path>
      <path d="M384 544C400 534 418 534 432 543" fill="none" stroke="#6a5039" stroke-width="2"></path>
      <text x="371" y="591" class="place-label">PELARGIR</text><text x="384" y="607" class="small-label">the haven on Anduin</text>
      <path d="M689 286C719 275 749 270 782 275C811 280 831 294 847 311" fill="none" stroke="#735036" stroke-width="2.2" stroke-dasharray="2 8"></path>
      <text x="795" y="267" class="small-label" transform="rotate(12 795 267)">MORGUL ROAD</text>
      <text x="176" y="157" class="place-label">EDORAS</text><text x="176" y="175" class="small-label">the road south</text>
      <text x="212" y="112" class="region-label" transform="rotate(-6 212 112)">ANÓRIEN</text><text x="737" y="134" class="region-label" transform="rotate(9 737 134)">ITHILIEN</text>
      <use href="#regionalMarker" transform="translate(719 292)"></use><use href="#regionalMarker" transform="translate(595 329)"></use><use href="#regionalMarker" transform="translate(509 279)"></use><use href="#regionalMarker" transform="translate(298 477)"></use><use href="#regionalMarker" transform="translate(365 440)"></use><use href="#regionalMarker" transform="translate(403 546)"></use><use href="#regionalMarker" transform="translate(442 211)"></use><use href="#regionalMarker" transform="translate(269 223)"></use>
      <g class="regional-cartouche"><path d="M62 529H310V581H62Z" fill="#ead39e" fill-opacity=".88" stroke="#6b4930" stroke-width="1.7"></path><text x="78" y="553" class="cartouche-title">GONDOR</text><text x="78" y="570" class="cartouche-note">the White City above the fields of war</text></g>
    `),

    "mordor-heart": plate("MORDOR", "Morannon · Gorgoroth · Orodruin", "Map of Mordor from the Black Gate and Udûn across Gorgoroth to Barad-dûr and Mount Doom", `
      <path d="M63 128C157 104 244 115 330 132C420 150 516 132 609 145C719 160 832 139 917 183C899 266 923 361 900 445C875 510 794 538 697 526C600 551 492 532 397 552C286 542 177 516 94 471C59 393 49 229 63 128Z" fill="#777663" opacity=".23" stroke="#5e5949" stroke-width="2"></path>
      <path d="M58 114L92 83L125 113L160 69L199 111L235 78L272 113L310 66L348 111L387 79L425 114" fill="#4e4034" opacity=".55" stroke="#3f3028" stroke-width="2.6" stroke-linejoin="round"></path>
      <path d="M64 115L92 92L114 114M132 114L160 78L186 111M208 112L235 87L260 113M282 113L310 75L335 111M359 112L387 88L415 113" fill="none" stroke="#a18761" stroke-width="1.6"></path>
      <text x="229" y="137" class="region-label" transform="rotate(-4 229 137)">ERED LITHUI</text>
      <path d="M100 124C85 181 106 230 94 286C82 344 105 399 91 463C83 502 92 539 85 572" fill="none" stroke="#4f4a40" stroke-width="34" opacity=".55"></path>
      <path d="M100 124C85 181 106 230 94 286C82 344 105 399 91 463C83 502 92 539 85 572" fill="none" stroke="#3f3a35" stroke-width="2.6"></path>
      <path d="M815 132C790 186 809 243 796 302C786 356 809 410 791 474C783 508 792 544 785 572" fill="none" stroke="#4f4a40" stroke-width="34" opacity=".55"></path>
      <path d="M815 132C790 186 809 243 796 302C786 356 809 410 791 474C783 508 792 544 785 572" fill="none" stroke="#3f3a35" stroke-width="2.6"></path>
      <text x="806" y="307" class="region-label" transform="rotate(84 806 307)">EPHEL DÚATH</text>
      <path d="M235 154C266 138 319 143 347 172C367 193 370 226 350 247C325 271 278 267 249 244C221 222 212 177 235 154Z" fill="#6d6b58" opacity=".28" stroke="#524f41" stroke-width="2"></path>
      <path d="M215 253C257 227 314 231 355 254C386 273 402 307 392 338C377 373 333 387 289 375C250 364 219 336 211 300C207 282 207 267 215 253Z" fill="#77765c" opacity=".24" stroke="#595846" stroke-width="1.8"></path>
      <text x="230" y="147" class="region-label" transform="rotate(-8 230 147)">DAGORLAD</text>
      <text x="255" y="386" class="region-label">UDÛN</text>
      <path d="M214 186C238 177 266 178 290 188C308 196 320 211 321 228" fill="none" stroke="#9b8962" stroke-width="1.6" stroke-dasharray="3 7"></path>
      <path d="M210 203L234 177L258 203L280 177L304 203" fill="none" stroke="#40332b" stroke-width="2.2"></path>
      <path d="M209 218H305" stroke="#40332b" stroke-width="3"></path>
      <path d="M223 218V190M291 218V190" stroke="#40332b" stroke-width="2"></path>
      <text x="204" y="238" class="place-label">BLACK GATE</text><text x="208" y="256" class="small-label">the Morannon</text>
      <path d="M330 225C386 204 444 206 504 224C557 241 603 224 660 238C713 251 752 279 784 319" fill="none" stroke="#5f4d3b" stroke-width="15" opacity=".3"></path>
      <path d="M330 225C386 204 444 206 504 224C557 241 603 224 660 238C713 251 752 279 784 319" fill="none" stroke="#46372d" stroke-width="2.4" stroke-dasharray="2 8" stroke-linecap="round"></path>
      <path d="M395 294C430 261 482 253 533 269C583 284 613 324 604 367C594 416 542 442 490 431C438 419 397 381 388 337C383 320 386 306 395 294Z" fill="#5d5d4f" opacity=".22" stroke="#4d4b40" stroke-width="1.8"></path>
      <text x="434" y="340" class="region-label" transform="rotate(-6 434 340)">GORGOROTH</text><text x="450" y="359" class="small-label">the Plateau of Shadow</text>
      <g transform="translate(689 221)" filter="url(#regionalInk)">
        <path d="M-43 89L-37 57L-19 57L-24 31L-7 31L-14 10L8 25L20 -6L30 25L50 11L43 35L62 35L52 60L68 60L75 91Z" fill="#332b28" stroke="#211d1b" stroke-width="2.2"></path>
        <path d="M-37 74L58 74M-27 56L49 56M-17 39L39 39M-6 23L29 23" fill="none" stroke="#80684c" stroke-width="2" opacity=".75"></path>
        <circle cx="21" cy="3" r="5" fill="#b56b43" stroke="#e6bf76" stroke-width="1.7"></circle>
      </g>
      <text x="647" y="335" class="place-label">BARAD-DÛR</text><text x="649" y="353" class="small-label">the Dark Tower</text>
      <path d="M708 271C667 283 634 309 607 343C577 381 550 408 519 444" fill="none" stroke="#806144" stroke-width="12" opacity=".3"></path>
      <path d="M708 271C667 283 634 309 607 343C577 381 550 408 519 444" fill="none" stroke="#4d392e" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"></path>
      <path d="M463 415C470 380 490 355 517 350C545 354 567 382 570 416C575 457 553 491 519 504C484 492 457 457 463 415Z" fill="#66564a" opacity=".5" stroke="#3f332d" stroke-width="2.2"></path>
      <path d="M467 418C486 405 501 399 519 399C537 399 555 406 568 419" fill="none" stroke="#b5543d" stroke-width="5" opacity=".76"></path>
      <path d="M473 439C492 423 504 420 519 421C536 421 550 430 563 443" fill="none" stroke="#c67544" stroke-width="3" opacity=".78"></path>
      <path d="M485 459C496 447 508 442 519 443C531 444 542 449 551 460" fill="none" stroke="#d58d4d" stroke-width="2.5" opacity=".75"></path>
      <path d="M519 354L480 428L500 428L482 459L508 453L493 480L519 469L545 480L530 453L556 459L538 428L558 428Z" fill="#3b302c" opacity=".78"></path>
      <text x="445" y="525" class="place-label">MOUNT DOOM</text><text x="460" y="543" class="small-label">ORODRUIN · the fire mountain</text>
      <path d="M518 462L518 507" stroke="#b4543d" stroke-width="2.6" stroke-dasharray="2 6"></path>
      <text x="537" y="501" class="place-label">CRACKS OF DOOM</text>
      <path d="M749 355C773 340 799 343 817 359C832 371 837 390 829 405C816 423 790 430 768 420C746 410 736 375 749 355Z" fill="#4b3a32" opacity=".5" stroke="#302824" stroke-width="2"></path>
      <path d="M759 386L776 361L794 386L811 363L825 388" fill="none" stroke="#b19468" stroke-width="1.8"></path>
      <text x="719" y="447" class="place-label">CIRITH UNGOL</text><text x="724" y="465" class="small-label">the high pass</text>
      <text x="148" y="550" class="small-label" transform="rotate(-8 148 550)">the ash road south</text><text x="319" y="484" class="small-label" transform="rotate(-6 319 484)">the road to Barad-dûr</text>
      <use href="#regionalMarker" transform="translate(240 136)"></use><use href="#regionalMarker" transform="translate(278 192)"></use><use href="#regionalMarker" transform="translate(384 198)"></use><use href="#regionalMarker" transform="translate(538 279)"></use><use href="#regionalMarker" transform="translate(691 229)"></use><use href="#regionalMarker" transform="translate(490 422)"></use><use href="#regionalMarker" transform="translate(518 477)"></use><use href="#regionalMarker" transform="translate(787 397)"></use>
      <g class="regional-cartouche"><path d="M62 529H310V581H62Z" fill="#ead39e" fill-opacity=".88" stroke="#6b4930" stroke-width="1.7"></path><text x="78" y="553" class="cartouche-title">MORDOR</text><text x="78" y="570" class="cartouche-note">three roads, one mountain, and the end of the Ring</text></g>
    `),

    "lindon": plate("LINDON", "the Shire · the Tower Hills · the Grey Havens", "Map of the road from the Shire through the Tower Hills to Lindon and the Grey Havens on the Gulf of Lhûn", `
      <path d="M62 146C141 113 237 124 319 151C395 176 464 151 535 157C626 166 706 141 789 156C866 170 915 211 906 286C897 361 925 441 883 500C816 541 719 527 638 540C537 559 441 535 355 553C255 541 163 522 91 476C60 395 48 231 62 146Z" fill="#a9b27f" opacity=".24" stroke="#6f7d58" stroke-width="2"></path>
      <path d="M721 91C697 139 709 180 697 224C687 267 704 316 690 358C677 406 698 456 684 543H921V91Z" fill="#839ba0" opacity=".28" stroke="#5d7b7b" stroke-width="2"></path>
      <path d="M727 91C704 141 717 184 704 227C693 272 711 316 697 360C684 408 705 459 691 543" fill="none" stroke="#547873" stroke-width="2.7"></path>
      <path d="M784 92C775 151 787 192 779 239C771 284 790 326 781 374C773 419 788 469 778 539" fill="none" stroke="#9ab4ad" stroke-width="18" opacity=".35"></path>
      <text x="803" y="314" class="water-label" transform="rotate(83 803 314)">GULF OF LHÛN</text>
      <path d="M62 196L102 153L145 195L184 143L228 193L270 156L312 196" fill="#6d6049" opacity=".29" stroke="#57432f" stroke-width="2.5"></path>
      <path d="M70 197L102 166L132 195M151 194L184 155L214 192M239 193L270 168L300 195" fill="none" stroke="#926f4c" stroke-width="1.6"></path>
      <text x="106" y="221" class="region-label" transform="rotate(-5 106 221)">THE BLUE MOUNTAINS</text>
      <path d="M161 276C220 243 299 248 350 288C392 320 400 375 371 414C338 456 262 461 207 432C151 402 126 311 161 276Z" fill="#79905e" opacity=".28" stroke="#5d714d" stroke-width="2"></path>
      <use href="#regionalForest" transform="translate(175 282) scale(.8)"></use><use href="#regionalForest" transform="translate(242 269) scale(.78)"></use><use href="#regionalForest" transform="translate(309 303) scale(.72)"></use><use href="#regionalForest" transform="translate(208 351) scale(.75)"></use><use href="#regionalForest" transform="translate(286 369) scale(.7)"></use>
      <text x="219" y="446" class="region-label" transform="rotate(-8 219 446)">THE SHIRE</text>
      <path d="M207 350C295 339 381 327 460 313C536 300 609 283 704 280" fill="none" stroke="#896744" stroke-width="15" opacity=".3"></path>
      <path d="M207 350C295 339 381 327 460 313C536 300 609 283 704 280" fill="none" stroke="#5a432f" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"></path>
      <path d="M484 226C516 201 562 200 593 222C618 240 627 273 610 298C590 327 545 334 512 316C477 298 459 248 484 226Z" fill="#8d8d68" opacity=".27" stroke="#6c654b" stroke-width="2"></path>
      <use href="#regionalMound" transform="translate(500 229) scale(.76)"></use><use href="#regionalMound" transform="translate(559 248) scale(.63)"></use><use href="#regionalMound" transform="translate(525 280) scale(.58)"></use>
      <text x="481" y="348" class="region-label">TOWER HILLS</text><text x="499" y="366" class="small-label">Emyn Beraid</text>
      <path d="M692 260C714 239 744 238 766 253C786 267 790 294 774 312C754 332 721 330 700 313C682 299 678 276 692 260Z" fill="#6f7652" opacity=".25" stroke="#596344" stroke-width="2"></path>
      <path d="M707 280L729 246L750 280L771 250L790 281" fill="none" stroke="#54402f" stroke-width="2"></path>
      <path d="M707 300C735 290 759 291 786 301" fill="none" stroke="#b88b56" stroke-width="2"></path>
      <text x="680" y="350" class="place-label">GREY HAVENS</text><text x="695" y="369" class="small-label">MITHLOND · the harbours</text>
      <path d="M770 326C795 308 823 310 844 329C863 347 861 374 844 390C825 408 794 402 777 384C762 368 758 343 770 326Z" fill="#66888a" opacity=".22" stroke="#4e6b6b" stroke-width="1.8"></path>
      <path d="M780 363H844M790 349H833M794 378H837" stroke="#698786" stroke-width="2"></path>
      <path d="M805 335L820 318L836 335V366H805Z" fill="#eee0b2" stroke="#5f4833" stroke-width="1.8"></path>
      <path d="M804 366L834 366M818 318V298M811 305L818 295L825 305" fill="none" stroke="#5f4833" stroke-width="1.8"></path>
      <path d="M838 370C864 355 885 350 907 357" fill="none" stroke="#5d7f7c" stroke-width="2.2" stroke-dasharray="3 8"></path>
      <path d="M173 404C203 390 229 391 253 406C269 416 277 434 272 450C259 469 231 475 207 465C184 455 163 422 173 404Z" fill="#8a7953" opacity=".26" stroke="#654b36" stroke-width="2"></path>
      <use href="#regionalMound" transform="translate(181 413) scale(.8)"></use>
      <text x="167" y="495" class="place-label">FAR DOWNS</text><text x="166" y="513" class="small-label">the road west</text>
      <text x="405" y="286" class="place-label">THE WESTMARCH</text><text x="418" y="304" class="small-label">toward the sea</text>
      <text x="827" y="197" class="region-label" transform="rotate(84 827 197)">LINDON</text>
      <text x="735" y="496" class="small-label">the long firth of Lhûn</text>
      <use href="#regionalMarker" transform="translate(192 341)"></use><use href="#regionalMarker" transform="translate(499 279)"></use><use href="#regionalMarker" transform="translate(768 322)"></use>
      <g class="regional-cartouche"><path d="M62 529H310V581H62Z" fill="#ead39e" fill-opacity=".88" stroke="#6b4930" stroke-width="1.7"></path><text x="78" y="553" class="cartouche-title">LINDON</text><text x="78" y="570" class="cartouche-note">the last road before the Sea</text></g>
    `)
  };
}());
