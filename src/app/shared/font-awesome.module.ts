import { NgModule } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { 
  faCamera, 
  faTrash, 
  faUser, 
  faUsers, 
  faCalendarAlt, 
  faTicketAlt, 
  faChartBar,
  faCog,
  faHome,
  faSignOutAlt,
  faTachometerAlt,
  faTags,
  faEuroSign,
  faArrowUp,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [FontAwesomeModule],
  exports: [FontAwesomeModule]
})
export class FontAwesomeIconsModule {
  constructor(library: FaIconLibrary) {
    // Ajouter les icônes à la bibliothèque FontAwesome
    library.addIcons(
      faCamera,
      faTrash,
      faUser,
      faUsers,
      faCalendarAlt,
      faTicketAlt,
      faChartBar,
      faCog,
      faHome,
      faSignOutAlt,
      faTachometerAlt,
      faTags,
      faEuroSign,
      faArrowUp,
      faArrowDown
    );
  }
} 