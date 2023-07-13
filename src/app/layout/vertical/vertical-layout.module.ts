import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';

import { NavbarModule } from 'app/layout/components/navbar/navbar.module';
import { ContentModule } from 'app/layout/components/content/content.module';
import { MenuModule } from 'app/layout/components/menu/menu.module';
import { FooterModule } from 'app/layout/components/footer/footer.module';

import { VerticalLayoutComponent } from 'app/layout/vertical/vertical-layout.component';
import { SharedModule } from 'app/components/shared.module';

const routes = [

];

@NgModule({
  declarations: [VerticalLayoutComponent],
  imports: [RouterModule, CoreCommonModule, CoreSidebarModule, NavbarModule, MenuModule, ContentModule, FooterModule, SharedModule],
  exports: [VerticalLayoutComponent]
})
export class VerticalLayoutModule {}
