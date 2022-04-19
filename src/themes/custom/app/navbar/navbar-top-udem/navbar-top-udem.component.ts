import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocaleService } from 'src/app/core/locale/locale.service';

@Component({
  selector: 'ds-navbar-top-udem',
  templateUrl: './navbar-top-udem.component.html',
  styleUrls: ['./navbar-top-udem.component.scss']
})

export class NavbarTopUdemComponent implements OnInit {


  // langue par default
  langue ='fr'
  // titre du logo par default
  imageLogo ='logo-papyrus-fr.png'
  constructor(private localeService: LocaleService) { }

  ngOnInit() {
    if(this.trouverLangueSession()!=null){
      this.langue=this.trouverLangueSession()}

    // titre du logo avec la session du langue
    this.imageLogo='logo-papyrus-'+this.langue+'.png'
  }
// fonction pour submit le form udemRecherche
  send() {
    // implimenter submit form
    console.log('Form non functionel')
  }

  // code ajouté par udem
  // truver la langue de la session pour afficher le bon logo
  trouverLangueSession(){
    return this.localeService.getCurrentLanguageCode()
  }
}
