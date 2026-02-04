import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profil',
  imports: [NgIf],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent implements OnInit {
  user: any = null;

  ngOnInit() {
    this.user = {
      "username": "ii2",
      "email": "tientcheuigorcarel@gmail.com",
      "createdAt": "2025-12-04T17:20:04.203+00:00",
      "updatedAt": "2026-01-12T13:05:09.421+00:00",
      "profilePhoto": null
    };
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  changePhoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.user.profilePhoto = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }
}
