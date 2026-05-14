import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-profil',
  imports: [NgIf],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent implements OnInit {
  user: any = null;
constructor(private authservice: AuthService) { }
  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.authservice.getProfile().subscribe({
      next: (data: any) => {
        this.user = {
          ...data,
          profilePhoto: data.imageUrl ? `http://localhost:3000${data.imageUrl}` : null,
        };
        localStorage.setItem('imageUrl', JSON.stringify(data.imageUrl || ''));
      },
      error: (err) => {
        console.error('Impossible de charger le profil', err);
        const storedUser = localStorage.getItem('user');
        const storedMail = localStorage.getItem('mail');
        const storedImageUrl = localStorage.getItem('imageUrl');

        if (storedUser) {
          this.user = {
            username: JSON.parse(storedUser),
            email: storedMail ? JSON.parse(storedMail) : '',
            profilePhoto:
              storedImageUrl && storedImageUrl !== '""'
                ? `http://localhost:3000${JSON.parse(storedImageUrl)}`
                : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
      },
    });
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
        this.authservice.updatePhoto(file).subscribe({
          next: (res: any) => {
            const imageUrl = res.imageUrl || '';
            this.user.profilePhoto = imageUrl ? `http://localhost:3000${imageUrl}` : null;
            localStorage.setItem('imageUrl', JSON.stringify(imageUrl));
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour de la photo', err);
          },
        });
      }
    };
    input.click();
  }
}
