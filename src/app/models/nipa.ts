

export interface BoundingBox {
  bottom: number;
  left: number;
  right: number;
  top: number;
}

export interface DetectedObject {
  bounding_box: BoundingBox;
  name: string;
  confidence: number;
  parent: string;
  color?: string;
}

export interface ResponseObjectDetection {
  service_id: string;
  detected_objects: DetectedObject[];
}

export interface Configuration {
  parameter: string;
  value: string;
}

export interface RequestObjectDetection {
  configurations?: Configuration[];
  raw_data: string;
}






