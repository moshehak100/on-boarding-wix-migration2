import axios from "axios";
import { Builder, By, Capabilities, logging, WebDriver, WebElement } from "selenium-webdriver";
import { GeneralButtonObject, GeneralContainerObject, GeneralImageObject, GeneralTextObject } from "./builder.structures";

const META_SITE_ID = 'd76b7bb1-5d96-4260-abff-0d2e1b134713';
const USER_ID = '8dc8b362-31bf-42f8-9687-018ce95593e6';
export const wix_editor_url = `https://editor.wix.com/html/editor/web/renderer/edit/79274075-b354-4468-b3cd-19b45733a2db?metaSiteId=${META_SITE_ID}&editorSessionId=884151b6-ada3-43d5-9453-8fa01413533e`;
// i've got those cookies via selenium "const newCookies = await driver.manage().getCookies();" command
export const cookies = [
    {
      domain: "manage.wix.com",
      httpOnly: false,
      name: "TSeb91ef98027",
      path: "/",
      secure: false,
      value: "0819ac4416ab20005b42abecd6b9d72519661fd76c2ebbf51f529113711a604881b22269326224be087bf076b9113000f6d736aeb8b7788c708ea68533ff72396a487a5d6bb658ab42f33caa2cc3b56f09a96d02f833c6e4ae56a6c06096b0c5",
    },
    {
      domain: ".wix.com",
      httpOnly: false,
      name: "_wix_browser_sess",
      path: "/",
      secure: false,
      value: "4f4067ac-dad4-4ecf-9f97-7a4fcd514a46",
    },
    {
      domain: ".wix.com",
      expiry: 1636908234,
      httpOnly: false,
      name: "_wixAB3|8dc8b362-31bf-42f8-9687-018ce95593e6",
      path: "/",
      secure: false,
      value: "130803#1|150438#4|175264#2|182661#2|185798#1|200674#4|205715#2|225455#1|269779#2|277909#1|280816#1|281144#2|286464#1|287210#2|289342#2|292946#2|294268#2|296773#1|297192#2|299055#2",
    },
    {
      domain: ".wix.com",
      expiry: 1644669831,
      httpOnly: false,
      name: "_wixUIDX",
      path: "/",
      sameSite: "None",
      secure: true,
      value: "820385561|8dc8b362-31bf-42f8-9687-018ce95593e6",
    },
    {
      domain: ".wix.com",
      expiry: 1794573830,
      httpOnly: false,
      name: "wixLanguage",
      path: "/",
      sameSite: "Lax",
      secure: false,
      value: "en",
    },
    {
      domain: ".wix.com",
      expiry: 1644669830,
      httpOnly: false,
      name: "userType",
      path: "/",
      secure: false,
      value: "REGISTERED",
    },
    {
      domain: ".wix.com",
      expiry: 1642682630,
      httpOnly: false,
      name: "wixClient",
      path: "/",
      sameSite: "None",
      secure: true,
      value: "moshehakimian2||VERIFIED_OPT_IN|0|1636893830501|1642682630501|8dc8b362-31bf-42f8-9687-018ce95593e6|{}|wix",
    },
    {
      domain: ".wix.com",
      expiry: 1636894348,
      httpOnly: false,
      name: "_px3",
      path: "/",
      sameSite: "Lax",
      secure: false,
      value: "d5f13d22008895d9a1a8426aae04b7952263364f6796d5a36237ed7a8152edfd:H1f5GmqsjxM+AsTmH3VoJ2k8ek3zTcOiUJpJpSAv/rfGIW8035/Ak/Md8ZVun6rw2VGrRyXtz3GT5OthBSTRqg==:1000:S+8ZXDwVKSwBQ17Xk1ZsH+9zqaX5TInKvrH8RSxoIRcp33jfBYmm+6ODhjWTwyT54XyYULga9HbrftYBHTPJc2cGvgzXb+vpTLmrQ8W3jeiYu7BtS3nZ3NBu3IZcyInsNhBPmPg370dOqBt1xyzc9oewtN3YmdqPY0eJWY04LlBenwxoJdnF3155yxcAC733m3LK+f47gXhSw2oINtJ54A==",
    },
    {
      domain: ".wix.com",
      expiry: 1642682630,
      httpOnly: true,
      name: "wixSession2",
      path: "/",
      sameSite: "None",
      secure: true,
      value: "JWT.eyJraWQiOiJrdU42YlJQRCIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1widXNlckd1aWRcIjpcIjhkYzhiMzYyLTMxYmYtNDJmOC05Njg3LTAxOGNlOTU1OTNlNlwiLFwidXNlck5hbWVcIjpcIm1vc2hlaGFraW1pYW4yXCIsXCJjb2xvcnNcIjp7fSxcInVjZFwiOlwiMjAyMS0xMS0xMVQxMjozMDozOS4wMDArMDAwMFwiLFwid3hzXCI6dHJ1ZSxcImV3eGRcIjp0cnVlLFwiYW9yXCI6dHJ1ZSxcImFjaVwiOlwiOGRjOGIzNjItMzFiZi00MmY4LTk2ODctMDE4Y2U5NTU5M2U2XCIsXCJybWJcIjp0cnVlLFwibHZsZFwiOlwiMjAyMS0xMS0xNFQxMjo0Mzo1MC40NjQrMDAwMFwiLFwibGF0aFwiOlwiMjAyMS0xMS0xNFQxMjo0Mzo1MC40NjQrMDAwMFwiLFwid3hleHBcIjpcIjIwMjEtMTEtMjlUMTI6NDM6NTAuNTAwKzAwMDBcIn0iLCJpYXQiOjE2MzY4OTM4MzAsImV4cCI6MTYzODE4OTgzMH0.mRp1gBVQXeDCFPUZCRMcIwb7zOhbUcXDjyYCRwo_rqz67O6oniakPLq95g61FpgkauvtPgMVn-EjM_w-9owNYKlLTQcth3fMuwwLzerryokfBI2DqL_8H6-s8-9dBavLLURvfX9qhKkCP-_bd8uCA1k9Yg9EYa-Vp68qBcHUwsoFHQ2WiISHAja5YEgwpkA7j74i_JtZzkam75XV8E_UCAOVBhbQHYLizXxJANSJ5n_HMA_-obmoPW5yHsr3eIwnGYOrcojGRn8h-LcMDEgApom5XACiIz2MK39JPeh6-w8kdcgQgW9fNbCLUtv5ZE9t-Foqtx5hB6KsvbD08J8K0Q",
    },
    {
      domain: ".wix.com",
      expiry: 1668429729,
      httpOnly: false,
      name: "_pxvid",
      path: "/",
      sameSite: "Lax",
      secure: false,
      value: "48a0fd6b-4548-11ec-855b-4f4f5278466a",
    },
    {
      domain: ".wix.com",
      expiry: 1644669831,
      httpOnly: false,
      name: "_wixCIDX",
      path: "/",
      sameSite: "None",
      secure: true,
      value: "f6b1fe21-fd4a-4c34-af8b-fda647398ec7",
    },
    {
      domain: ".wix.com",
      expiry: 1652445834,
      httpOnly: false,
      name: "_wixAB3",
      path: "/",
      secure: false,
      value: "290223#2",
    },
    {
      domain: ".wix.com",
      httpOnly: false,
      name: "XSRF-TOKEN",
      path: "/",
      sameSite: "None",
      secure: true,
      value: "1636893726|YzQ9c3TThzZl",
    },
  ];
export const sleep = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function buildSite(elements: any) : Promise<any> {
  const driver = await new Builder().
                    forBrowser('chrome').
                    build();
  
  try{
    await loginToSite(driver);
    await sleep(10000);
    await selectBrowserFrame(driver);
    const wixElements = convertToWixElements(elements);
    const body = await driver.executeScript(addItemsToWix, wixElements);
    //await sleep(10000);
    return wixElements;
     
  } catch(err: any){
    console.error("error->", err);
  } finally{
    driver.quit();
  }
}

async function selectBrowserFrame(driver: WebDriver){
    const preview = await driver.findElement(By.xpath("//iframe[@id='preview']"));
    await driver.switchTo().frame(preview);
}

async function convertToWixElements(gElements: (GeneralTextObject | GeneralImageObject | GeneralContainerObject | GeneralButtonObject)[]){
    const elements = [];
    gElements.sort((a, b) => {
            if (a.zIndex === b.zIndex)
                return a.type === "text"? 1 : -1;
            else
                return a.zIndex - b.zIndex;
        });

    for(const e of gElements){
        try{
            switch(e.type){
                case "text": 
                    const textE = convertToWixTextElement(e as GeneralTextObject);
                    elements.push(textE);
                    break;
                case "img":
                    const imageE = await convertToWixImageElement(e as GeneralImageObject);
                    elements.push(imageE);
                    break;
                case "container":
                    const contE = convertToWixContainerElement(e as GeneralContainerObject);
                    elements.push(contE);
                    break;
                case "button":
                    const btnE = convertToWixButtonElement(e as GeneralButtonObject);
                    elements.push(btnE);
                    break;
                default:
                    console.error("Unknown element type " + e.type)
            }
        }catch(error){
            console.error('element build failed ' + e + " details:" + error);
        }
    }

    return elements;
}
function convertToWixTextElement(item: GeneralTextObject){
  return {
    style: "txtTheme",
    data: {
      "linkList": [],
      "text": item.text,
      "stylesMapId": "CK_EDITOR_PARAGRAPH_STYLES",
      "type": "StyledText",
            "metaData": {
                "isPreset": false,
                "schemaVersion": "1.0",
                "isHidden": false
            }
        },
        "componentType": "wysiwyg.viewer.components.WRichText",
        "id": "WRichTextStyleFont1",
        "layout": {
            "x": item.x,
            "fixedPosition": false,
            "y": item.y,
            "scale": 1,
            "height": item.height,
            "rotationInDegrees": 0,
            "width": item.width
        },
        "type": "Component",
        "skin": "wysiwyg.viewer.skins.WRichTextThemeSkin"
    }
  }

async function convertToWixImageElement(item: GeneralImageObject) {
    const imageUploadRes = await uploadImage({imageName: item.alt, imageUrl: item.src});
    const imageWixUrl = imageUploadRes[0].fileName;

    return {
        "componentType": "wysiwyg.viewer.components.WPhoto",
        "layout": {
            "width": item.width,
            "height": item.height,
            "x": item.x,
            "y": item.y,
            "rotationInDegrees": 0,
            "scale": 1,
            "fixedPosition": false,
            "anchors": []
        },
        "data": {
            "width": item.width,
            "height": item.height,
            "alt": item.alt,
            "name": item.alt,
            "uri": imageWixUrl,
            "type": "Image",
            "description": ""
        },
        "props": {
            "type": "WPhotoProperties"
        },
        "style": "wp2"
    }
}

function convertToWixContainerElement(item: GeneralContainerObject) {
    return {
        "type": "Container",
        "metaData": {
            "sig": "u7z-141",
            "pageId": "z5sei"
        },
        "components": [],
        "skin": "wysiwyg.viewer.skins.area.DefaultAreaSkin",
        "layout": {
            "width": item.width,
            "height": item.height,
            "x": item.x,
            "y": item.y,
            "scale": 1,
            "rotationInDegrees": 0,
            "fixedPosition": false
        },
        "componentType": "mobile.core.components.Container",
        "parent": "comp-jawn1lh0",
        "style": {
            "type": "ComponentStyle",
            "metaData": {
                "isPreset": false,
                "schemaVersion": "1.0",
                "isHidden": false,
                "sig": "vp3-103",
                "pageId": "z5sei"
            },
            "style": {
                "groups": {},
                "properties": {
                    "alpha-bg": "1",
                    "alpha-brd": "1",
                    "bg": item.style.backgroundColor,
                    "boxShadowToggleOn-shd": "false",
                    "brd": item.style.borderColor,
                    "brw": item.style.borderWidth,
                    "rd": item.style.borderRadius,
                    "shd": "0px 1px 4px 0px rgba(0,0,0,0.6)"
                },
                "propertiesSource": {
                    "alpha-bg": "value",
                    "alpha-brd": "value",
                    "bg": "value",
                    "boxShadowToggleOn-shd": "value",
                    "brd": "value",
                    "brw": "value",
                    "rd": "value",
                    "shd": "value"
                }
            },
            "componentClassName": "mobile.core.components.Container",
            "pageId": "",
            "compId": "",
            "styleType": "custom",
            "skin": "wysiwyg.viewer.skins.area.DefaultAreaSkin"
        },
        "activeModes": {},
        "id": "comp-jawn1lh5"
    }
}

function convertToWixButtonElement(item: GeneralButtonObject) {
    return {
        "componentType": "wixui.StylableButton",
        "style": {
            "style": {
                "properties": {
                    "$st-css": `:import{\n    -st-from: 'wix-ui-santa/index.st.css';\n    -st-named: StylableButton\n}\n.root{\n    -st-extends: StylableButton;\n    transition: all 0.2s ease, visibility 0s;\n    border-radius: ${item.style.borderRadius} background: ${item.style.backgroundColor}\n}\n.root:hover{\n    border: ${item.style.borderWidth} ${item.style.borderColor};\n    background: ${item.style.backgroundColor}\n}\n.root:hover::label{\n    color: ${item.style.labelStyle.color}\n}\n.root:disabled{\n    background: #E2E2E2\n}\n.root:disabled::label{\n    color: #8F8F8F\n}\n.root:disabled::icon{\n    fill: #8F8F8F\n}\n.root::container{\n    transition: inherit\n}\n.root::label{\n    transition: inherit;\n    font-family: futura-lt-w01-book,sans-serif;\n    margin: 0px 4px 0px 0px;\n    font-size: ${item.style.labelStyle.fontSize};\n    letter-spacing: 0.1em;\n    -st-mixin: font_8;\n    color: ${item.style.labelStyle.color}\n}\n.root::icon{\n    transition: inherit;\n    width: 10px;\n    height: 10px;\n    margin: 0px 0px 0px 4px;\n    fill: value(site_1_1);\n    display: none\n}\n.root:hover::icon{\n    fill: value(site_1_5)\n}`
                },
                "groups": {},
                "propertiesSource": {}
            },
            "type": "ComponentStyle",
            "styleType": "custom",
            "compId": "",
            "componentClassName": "wixui.StylableButton",
            "pageId": "",
            "skin": "wixui.skins.Skinless",
            "metaData": {
                "isPreset": false,
                "schemaVersion": "1.0",
                "isHidden": false,
                "pageId": "c1dmp",
                "sig": "zw4-1173",
                "basedOnSignature": "zw4-1172"
            },
            "id": "style-kvpbtn1c"
        },
        "layout": {
            "width": item.width,
            "height": item.height,
            "x": item.x,
            "y": item.y
        },
        "type": "Component",
        "data": {
            "label": item.label,
            "svgId": "b861b040274141de9c08999ec3b76edf.svg",
            "type": "StylableButton",
            "metaData": {
                "isPreset": false,
                "schemaVersion": "1.0",
                "isHidden": false
            }
        },
        "props": {
            "type": "StylableButtonProperties",
            "metaData": {
                "isHidden": false,
                "isPreset": true,
                "schemaVersion": "1.0"
            }
        }
    }
}

var addItemsToWix = function (components: (any)[]) {
  //return components;
    for(const component of components){
      //@ts-ignore
      const wixId = documentServices.components.add(
        { id: 'c1dmp', type: 'DESKTOP' },
        component
      );

    //   //@ts-ignore
    //   if(component.style == "txtTheme"){
    //       //@ts-ignore
    //     documentServices.components.arrangement.moveForward(
    //         { id: wixId.id, type: 'DESKTOP' }
    //       );
    //   }
    };
  }
  

async function addCookies(driver: WebDriver){
  for (const cookie of cookies) {
    if (cookie.domain === '.wix.com') {
      await driver.manage().addCookie(cookie);
    }
  }
}

async function loginToSite(driver: WebDriver) : Promise<void>{
  await driver.get(wix_editor_url);
  await addCookies(driver);
  await driver.get(wix_editor_url);
}

async function uploadImage (image : {imageName:string,imageUrl:string}):Promise<{fileName:string}[]> {
    try {
      const { data } = await axios.post(
        `https://bo.wix.com/site-migration-site-builder/uploadImages?userId=${USER_ID}&metasiteId=${META_SITE_ID}`,
        [image],
        {
          headers: {
            authorization: 'f11f94f6-ba55-4d52-84a7-b42ce92a1ac1',
            'Content-Type': 'application/json',
          },
        }
      );
      return data;
    } catch (error) {
        throw error;
    }
  };