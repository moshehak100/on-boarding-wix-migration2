import { Builder, By, Capabilities, logging, WebDriver, WebElement } from "selenium-webdriver";

const caps = new Capabilities();
caps.setPageLoadStrategy("eager");

export async function scrapSite(url:any) : Promise<any>{
    let gElements: any[] = [];
  
  let driver = await new Builder().
                withCapabilities(caps).
                forBrowser('chrome').
                build();
  try {
    await driver.get(url);  

    const pageElement = await driver.findElement(By.id("pageContent"));
    gElements.push(...await getTextElements(driver, pageElement));
    gElements.push(...await getImageElements(pageElement));
    gElements.push(...await getContainerElements(pageElement));
    gElements.push(...await getButtonElements(pageElement));

  } finally {
  await driver.quit();
  }

  return gElements;
}


const getTextElementContentAsGenricHtml = async (driver: WebDriver, pageElement: WebElement) => {
  const element = await pageElement.findElement(By.className("page_welcome_3"));
  const tag = await element.getTagName();

  const children = await element.findElements(By.xpath("child::h1"));
  for(const child of children)
  {
    console.log('inner html : ', await child.getAttribute("innerHTML"));
  }
}

const getButtonElements = async (driver: WebElement) => {
  let gElements = [];
  const buttons = await driver.findElements(By.className("linkButton"));
  for(const element of buttons){
    const gElement = await createGenericButtonElement(element);
    gElements.push(gElement);
    console.log(gElement);
  }
  return gElements;
}

const createGenericButtonElement = async (element: WebElement) => {
  const rect = await element.getRect();
  const zIndex = await element.getCssValue("z-index");

  return  {
    type:"button",
    x: Number.parseInt(await element.getCssValue("left"), 10),
    y: Number.parseInt(await element.getCssValue("top"), 10),
    width:rect.width,
    height: rect.height,
    label: await element.getAttribute("innerText"),
    style:{
      backgroundColor: await element.getCssValue("background-color"),
      borderWidth: await element.getCssValue("border-width"),
      borderRadius: await element.getCssValue("border-radius"),
      borderColor: await element.getCssValue("border-color"),
      labelStyle:{
          fontSize:await element.getCssValue("font-size"),
          fontWeight:await element.getCssValue("font-weight"),
          color:await element.getCssValue("color")
      }
    },
    zIndex: zIndex
  }
}

const getContainerElements = async (driver: WebElement) => {
  let gElements = [];
  const images = await driver.findElements(By.className("simpleRectangle"));
  for(const element of images){
    const gElement = await createGenericContainerElement(element);
    gElements.push(gElement);
    console.log(gElement);
  }
  return gElements;
}

const createGenericContainerElement = async (element: WebElement) => {
  const rect = await element.getRect();
  const zIndex = await element.getCssValue("z-index");

  return  {
    type:"container",
    x: Number.parseInt(await element.getCssValue("left"), 10),
    y: Number.parseInt(await element.getCssValue("top"), 10),
    width:rect.width,
    height: rect.height,
    style:{
      backgroundColor: await element.getCssValue("background-color"),
      borderWidth: await element.getCssValue("border-width"),
      borderRadius: await element.getCssValue("border-radius"),
      borderColor: await element.getCssValue("border-color")
  },
    zIndex: Number.parseInt(zIndex)
  }
}

const getImageElements = async (driver: WebElement) => {
  let gElements = [];
  const images = await driver.findElements(By.tagName("img"));
  for(const element of images){
    const gElement = await createGenericImageElement(element);
    gElements.push(gElement);
    console.log(gElement);
  }
  return gElements;
}

const createGenericImageElement = async (element: WebElement) => {
  const rect = await element.getRect();
  const zIndex = await element.getCssValue("z-index");

  return  {
    type:"img",
    x: Number.parseInt(await element.getCssValue("left"), 10),
    y: Number.parseInt(await element.getCssValue("top"), 10),
    width:rect.width,
    height: rect.height,
    src: await element.getAttribute("src"),
    alt: await element.getAttribute("alt"),
    zIndex: Number.parseInt(zIndex)
  }
}

async function getTextElements(driver: WebDriver, webElement: WebElement){
  let gElements = [];
  const textIdentefier = ['body', 'title'];
  for(const id of textIdentefier){
    const elements = await webElement.findElements(By.className(id));
    for(const element of elements){
      const gElement = await createGenericTextElement(driver, element);
      gElements.push(gElement);
      console.log(gElement);
    }
  }
  return gElements;
}

const textAttributes = ['color', 'font-size', 'font-weight', 'background-color'];

const createGenericTextElement = async (driver: WebDriver, element: WebElement) => {
  const rect = await element.getRect();
  const zIndex = await element.getCssValue("z-index");
    const innnerHtmlText = await driver.executeScript(
        getElementInnerHtmlWithInlineStyle,
        await element.getAttribute('className'),
         textAttributes);

  return  {
    type:"text",
    x: Number.parseInt(await element.getCssValue("left"), 10),
    y: Number.parseInt(await element.getCssValue("top"), 10),
    width:rect.width,
    height: rect.height,
    text: innnerHtmlText,
    zIndex: Number.parseInt(zIndex)
  }
}

const getElementInnerHtmlWithInlineStyle = (elementClass:string,attributes:string[]) =>
{        
    //@ts-ignore
    var element = document.getElementsByClassName(elementClass)[0];
    const isTextNode = (node: any) => node.nodeType === node.TEXT_NODE;
    const isSimpleNode = (childNodes: any) =>
        childNodes.length === 1 && isTextNode(childNodes[0]);
    const getInnerText: any= (node: any) =>
    {
        if(isTextNode(node))
        return node.textContent;
        let childNodes = node.childNodes;          
        let innerText = isSimpleNode(childNodes)?
                        node.outerText:
                        Array.from(childNodes).map(getInnerText).join('');
        return createHtmlNode(node, innerText);
    }
    const createHtmlNode = (node: any,innerText: string) =>
        `<${node.localName} style="${getElementStyle(node,attributes)}">
        ${innerText}
        </${node.localName}>`;
    const getElementStyle = (node: any,attributes: string[]) =>
        attributes.map(attribute =>
        `${attribute}:${getCssProperty(node,attribute)}`).join(';');
    const getCssProperty = (node: any,Property: string) =>
        //@ts-ignore
        getComputedStyle(node,null).getPropertyValue(Property);
    return getInnerText(element).replace(/\n/g,'').replace(/\s+/g,' ');        
}

