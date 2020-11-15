<script>
  import { createEventDispatcher } from 'svelte'
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text/index';

  const dispatch = createEventDispatcher();

  export const open = () => dialog.open();

  let dialog;
  let lyrics = `Ich sitz' in einem Star+bucks in Phuket
Mobiles Netz ist schneller~ als daheim
Vielleicht bringt mir dieser U+~+rlaub ja an+dere Kultu+~+ren nah
Ich sitz' in einem Star+bucks in Phuket
Starbucks in Phuket
Bedient von einer Kellnerin aus Mainz
ja, aus Mainz
Vielleicht ist das der moderne Style
Wie man nach den Sternen greift
Vielleicht, oh, vielleicht
Vielleicht


Ciao, ich bin raus, wer suchet, verschwinde
Manchmal googel' ich Orte, die man bei Google nicht findet
Ich will da, wo das Touri-Gesindel seinen Fuß niemals hinsetzt
Einen Fuß hinsetzen, Touris sind immer noch die andern
Ich will Jahrtausende alte, ohne Ende von Profi-Cams abgelichtete
Monumente mitm Fotohandy knipsen
In den Landessprachen denselben Fraß bestellen
Wie in meinen Stammlokalen, "You have Hammelbraten?"
Ich will bei Ramsch-Händlern überteuerte Andenken kaufen
Die am Ende aufm Wandschrank verstauben
Will, dass Grün auf meine Netzhaut fällt
Nur, dass man sich nicht ins Gewächshaus stellt
Sondern in ein Trekkingzelt
Denn ich will gute Luft, ich bin naturbewusst
Ich zahle auch den Preis, Flugzeugschmutz im CO2-Fußabdruck
Will von Check-in zu Check-in im Hektik-Modu
Gepäck verloren, Infektionen
Oder mit den Stresshormonen eines Jet-Piloten
Geld wechseln, Strom an der Hotelrezeption
Runterkommen von der Reise, ich bestell' Beck's in Dosen
Such' ein'n deutschen Sender im Television, Selbstreflexion
Als sie mich fragen, "Wie gefällt es, Señor?"

Ich fühl' mich wie zuhause
Nur zuhause will ich weg
Und wieder buch' ich Flüge auf die Schnauze
Von zuhause in die Traufe
Denn woanders ist auch, wenn man das genau
Betrachtet, ein verkapptes Hier
Déjà-vu, aus dem Boden wachsen Dinge (überall)
Ich seh' Opel, ich seh' Pringles
Und den Mond niemals von hinten
Déjà-vu, alle atmen, manche rauchen (überall)
Menschen fragen nach dem Glauben
Man hat Kater nachm Saufen
Déjà-vu, alle rennen, wenn sie müssen (überall)
Manche Menschen haben Brüste
Teenies kämpfen mit Gelüsten
Déjà-vu, Menschen stapeln ein paar Steine
Und dann haben sie 'ne Bleibe (überall)
Ohne Nahrung ist es scheiße


Fotografier' mir die Finger wund, akribischer Hintergrund
Ich bin hier nicht zum Spaß, ich produziere Erinnerung
E-E-Erinnerung für finstre Stunden
Denn Jobroutine und Kinderwunsch ist wie eine Hinrichtung

Heimat, Heimat, Heimat, Heimat
Heimat, Heimat, Heimat, Heimat

Hola, wieder da, es war so amazing
Eindrücke gesammelt, als wärn's Dro-, äh, -phäen
Fliegende Fische, karibische Rhythmen, Liebesgeschichten
Hätt' ich nicht alles schon gepostet, gäb' es viel zu berichten
Ich bin wie neugebor'n (ohh), keine schwere Geburt
Man sieht's am indigenen Tattoo und meiner Break-up-Frisur
Damn, right, ich change auch die Art, wie ich sprech', ey
"Alles fresh, Mate?" ist meine neue Catchphrase
Vom Fast-Food-Narre zum gefühlten Vegetarier
Heute ess' ich nur noch Kühe, die Ferrari fahr'n
Ich mach' jetzt Sport (so amazing), nächsten Sommer Probetraining
Wieder ist für immer Schluss mit meiner Alkohol-Karriere
Neues Hobby: Skulpturen töpfern
Meine neue Religion ist radikal
Ich durchlöcher' dich jetzt für Naturgötter
Seitdem ich Bungee-Springer bin, habe ich Kammerflimmern
Ich will doch bloß anders sein, so wie die andern Kinder
Man hat den Trend gehasst, bis man wutschnaubend erkennt
Den Trend zu hassen ist auch nur ein Trend
Für manche Ausreisen hab' ich einen Ausweis gebraucht
Aber kein Passport bringt mich aus meiner Haut
Erfinde mich neu, doch erzeuge dabei nur ein Replikat (Replikat)
Drehe mein Leben am Horizont, 360 Grad (360 Grad)
Auch mit der äußeren Säuberung bleibt meine Weste schwarz (Weste schwarz)
Wechselbar, schlechter Tag, Hexenjagd
Denn ich renne vor mir selber weg
Und denke, wenn ich schneller als Gedanken bin
Dann lass' ich meine Fehler hinter mir
Doch sogar mit der Fähigkeit zu fliegen bleib' ich ein Gefangener
Wie dieses Federvieh in einer Legebatterie
Begebe mich in die Verlegenheit mit meiner Wenigkeit
Allein zu sein, aber da war mir meine Wenigkeit zu viel
Ich hock' im Ferien-Paradies mit einer mittelschweren Lego-Allergie

Ich reise dieser Erde in den Schoß
Doch ich werde mich nicht los
Alle meine Fehler, alle meine Fehler
Alle meine Fehler im Gepäck
Ich reise via Airline und mit Floß
Doch ich werde mich nicht los
Alle meine Fehler, alle meine Fehler
Alle meine Fehler im Gepäck
Die räumlichen Entfernungen sind groß
Doch ich werde mich nicht los
Alle meine Fehler, alle meine Fehler
Alle meine Fehler im Gepäck
Ich greife nach den Sternen und dem Kloß
Doch ich werde mich nicht los
Alle meine Fehler, alle meine Fehler
Alle meine Fehler im Gepäck, ohh

Ich fühl' mich wie zuhause
Nur zuhause will ich weg`;
</script>

<style>
  .lyrics-container
  {
    width: 500px;
    padding-top: 10px;
  }

  .lyrics-container :global(.mdc-text-field__input)
  {
    height: calc(100vh - 202px);
    white-space: nowrap;
  }
</style>

<Dialog bind:this={dialog} aria-labelledby="lyrics-dialog-title" aria-describedby="lyrics-dialog-content">
  <Title id="lyrics-dialog-title">Import Lyrics</Title>
  <Content id="lyrics-dialog-content">
    <div class="lyrics-container">
      <Textfield fullwidth textarea bind:value={lyrics} label="Lyrics" input$aria-controls="helper-text-lyrics" input$aria-describedby="helper-text-lyrics" />
      <HelperText id="helper-text-lyrics">Paste Lyrics separated in lines and syllables using + character</HelperText>
    </div>
  </Content>
  <Actions>
    <Button color="secondary">
      <Label>Cancel</Label>
    </Button>
    <Button disabled={!lyrics} on:click={() => dispatch('import', lyrics)}>
      <Label>Import</Label>
    </Button>
  </Actions>
</Dialog>