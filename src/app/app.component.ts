import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { DetectedObject, RequestObjectDetection, ResponseObjectDetection } from './models/nipa';
import { ApiService } from './services/api.service';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'nipa-test';

  selectedFiles: any;
  currentFile?: File;
  formData: FormData = new FormData();
  imagePreview: any;
  filePath: string;
  analyzedResult: ResponseObjectDetection;

  height: number;
  width: number;

  camHeight = (window.innerHeight * 0.675);
  camWidth = (window.innerWidth);

  public multipleWebcamsAvailable = false;
  // latest snapshot
  public webcamImage: WebcamImage = null;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  showWebcam: boolean;

  constructor(
    private service: ApiService,
    private spinner: NgxSpinnerService,

  ) {


  }
  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  ngAfterContentChecked() {

  }

  fileUpload(event: any) {
    this.analyzedResult = null;
    this.selectedFiles = event.target.files[0];
    var reader = new FileReader();
    const Img = new Image();

    reader.readAsDataURL(event.target.files[0]); // read file as data url
    Img.src = URL.createObjectURL(event.target.files[0]);
    const maxAllowedSize = 3 * 1024 * 1024;
    if (event.target.files[0].size > maxAllowedSize) {
      // Here you can ask your users to load correct file
      event.target.value = ''
    }
    reader.onload = (event) => { // called once readAsDataURL is completed
      this.imagePreview = event.target?.result
      this.upload();
    }

    Img.onload = (e: any) => {
      this.height = e.path[0].height;
      this.width = e.path[0].width;
    }

  }

  getSize() {
    this.analyzedResult = null;
    const Img = new Image();
    Img.src = this.imagePreview;
    Img.onload = (e: any) => {
      this.height = e.path[0].height;
      this.width = e.path[0].width;
    }
    this.upload();

  }

  upload() {
    var base64 = this.imagePreview.replace(/^data:image\/[a-z]+;base64,/, "");

    const request: RequestObjectDetection = {
      raw_data: base64
    }
    this.spinner.show();
    this.service.upload(request).pipe().subscribe((r) => {
      if (r) {
        this.spinner.hide();
        this.analyzedResult = r;
      }
    }, error => {
      this.spinner.hide();
      Swal.fire({
        icon: 'error',
        title: 'Somethin Wrong',
        text: 'Error during upload',
        confirmButtonText: 'ตกลง',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        scrollbarPadding: false,
      });

    })
  }

  getBorder(box: DetectedObject) {
    let dimension = box.bounding_box;
    const top = (dimension.top / this.height) * 100;
    const left = (dimension.left / this.width) * 100;
    const right = (dimension.right / this.width) * 100;
    const bottom = ((this.height - dimension.bottom) / this.height) * 100;
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    Object.assign(box, { color: `#${randomColor}` });
    return (`top: ${top}%; left: ${left}%; bottom: ${bottom}%; right: ${right}%; width: calc(${right}% - ${left}%); height: calc(100% - ${top}%) - ${bottom};border-color: #${randomColor}` ?? null)
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleImage(webcamImage: WebcamImage): void {
    $('#camera').modal('hide')
    this.showWebcam = false;
    this.imagePreview = webcamImage.imageAsDataUrl;
    this.getSize()
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }
}
