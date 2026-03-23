# ITA - Sistem za upravljanje dogodkov

## Opis projekta


Ta projekt predstavlja mikrostoritveni sistem za upravljanje dogodkov. Sistem omogoča uporabnikom pregled dogodkov, prijavo na dogodke ter upravljanje uporabniških računov.

Aplikacija je sestavljena iz več neodvisnih mikrostoritev, ki komunicirajo prek API-jev. Vsaka storitev je odgovorna za določen poslovni del sistema. Takšna arhitektura omogoča boljšo razširljivost, lažje vzdrževanje in neodvisen razvoj posameznih komponent.

Uporabniki dostopajo do sistema prek spletnega uporabniškega vmesnika, ki komunicira z mikrostoritvami.

Funkcionalnosti


## Sistem omogoča:


- registracijo in prijavo uporabnikov

- pregled vseh razpoložljivih dogodkov

- ustvarjanje in upravljanje dogodkov

- prijavo uporabnikov na dogodke

- pregled prijav na posamezen dogodek

Arhitektura sistema


## Sistem temelji na mikrostoritveni arhitekturi in je sestavljen iz naslednjih komponent:

1. Storitev uporabniki


Storitev skrbi za upravljanje uporabnikov.

Glavne naloge:


- registracija uporabnikov

- prijava uporabnikov

- upravljanje uporabniških podatkov

## Storitev ima svojo podatkovno bazo, v kateri so shranjeni podatki o uporabnikih.

2. Storitev dogodki


## Storitev upravlja dogodke v sistemu.

### Glavne naloge:


- ustvarjanje dogodkov

- urejanje dogodkov

- pregled dogodkov

- brisanje dogodkov

Vsak dogodek vsebuje podatke kot so naslov dogodka, opis, datum in lokacija.

3. Storitev prijave


Storitev upravlja prijave uporabnikov na dogodke.

### Glavne naloge:


- prijava uporabnika na dogodek

- odjava z dogodka

- pregled prijavljenih uporabnikov na dogodek

- preverjanje ali je uporabnik prijavljen na določen dogodek

Ta storitev povezuje uporabnike in dogodke.

4. Spletni uporabniški vmesnik


Spletna aplikacija predstavlja uporabniški vmesnik sistema. Prek nje uporabniki dostopajo do funkcionalnosti sistema.

Vmesnik komunicira z mikrostoritvami prek HTTP API klicev.

Arhitekturna načela


Sistem sledi načelom čiste arhitekture (Clean Architecture):


- poslovna logika je ločena od infrastrukture

- mikrostoritve so med seboj ohlapno sklopljene

- vsaka storitev ima lastno podatkovno bazo

- komunikacija med storitvami poteka prek jasno definiranih API-jev

Struktura projekta odraža poslovne koncepte sistema (uporabniki, dogodki, prijave), kar sledi principu "screaming architecture".

Struktura repozitorija


## Repozitorij je organiziran tako, da jasno ločuje posamezne mikrostoritve:


- services
	- uporabniki

	- dogodki

	- prijave


- web-app

Vsaka mikrostoritev vsebuje svojo poslovno logiko, API in infrastrukturo.

Namen projekta


Namen projekta je prikazati uporabo mikrostoritvene arhitekture, načel čiste arhitekture ter upravljanje komunikacije med več neodvisnimi storitvami v sodobnih spletnih aplikacijah.

## Nova storitev dogodki (gRPC)

Dodana je nova mikrostoritev `events`, ki uporablja gRPC in ima svojo ločeno Convex podatkovno bazo.

### Potrebne okoljske spremenljivke (docker compose)

- `EVENTS_CONVEX_URL`
- `EVENTS_CONVEX_ADMIN_KEY` (opcijsko)
- `USERS_CONVEX_URL`
- `USERS_CONVEX_ADMIN_KEY` (opcijsko)

### Opombe

- Frontend komunicira z dogodki prek Next.js API mostu (`/api/events`), ta pa kliče gRPC storitev `events:8080`.
- Pred zagonom je potrebno inicializirati ločen Convex deployment za mapo `events`.
