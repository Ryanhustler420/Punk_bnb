import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Platform} from '@ionic/angular';
import {
  Plugins,
  Capacitor,
  CameraSource,
  CameraResultType,
} from '@capacitor/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @Output() imagePick = new EventEmitter<string>();
  selectedImage: string;

  constructor(private platform: Platform) {}

  ngOnInit() {
    console.log('Mobile:', this.platform.is('mobile'));
    console.log('Hybrid:', this.platform.is('hybrid'));
    console.log('iOS:', this.platform.is('ios'));
    console.log('Android:', this.platform.is('android'));
    console.log('Desktop:', this.platform.is('desktop'));
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }

    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.Base64,
    })
      .then(image => {
        this.selectedImage = image.base64Data;
        this.imagePick.emit(image.base64Data);
      })
      .catch(err => {
        console.log(err);
        return false;
      });
  }
}