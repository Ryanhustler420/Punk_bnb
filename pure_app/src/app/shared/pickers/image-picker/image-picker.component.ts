import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
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
  @ViewChild('filePicker') filePicker: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();
  selectedImage: string;
  usePicker = false;
  isLoading = false;

  constructor(private platform: Platform) {}

  ngOnInit() {
    // console.log('Mobile:', this.platform.is('mobile'));
    // console.log('Hybrid:', this.platform.is('hybrid'));
    // console.log('iOS:', this.platform.is('ios'));
    // console.log('Android:', this.platform.is('android'));
    // console.log('Desktop:', this.platform.is('desktop'));
    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.usePicker = true;
    }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePicker.nativeElement.click();
      return;
    }
    this.isLoading = true;
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
        this.isLoading = false;
        this.imagePick.emit(image.base64Data);
      })
      .catch(err => {
        // console.log(err);
        this.isLoading = false;
        if (this.usePicker) {
          this.filePicker.nativeElement.click();
        }
        return false;
      });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    this.isLoading = true;
    const fr = new FileReader();

    fr.readAsDataURL(pickedFile);

    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.isLoading = false;
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
  }
}
