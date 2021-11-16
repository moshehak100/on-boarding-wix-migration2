

export class GeneralTextObject {
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    zIndex: number;
  }

  export interface GeneralImageObject {
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    src: string;
    alt: string;
    zIndex: number;
  }

  export interface GeneralContainerObject {
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    style: {
        backgroundColor:string;
        borderWidth: string;
        borderRadius: string;
        borderColor:string;
    }
    zIndex: number;
  }

  export interface GeneralButtonObject {
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    style: {
        backgroundColor:string;
        borderWidth: string;
        borderRadius: string;
        borderColor:string;
        labelStyle:{
            fontSize:number;
            color:string;
        }
    }
    zIndex: number;
  }