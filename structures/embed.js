module.exports = class Embed {
  constructor(title, description) {
    this.title = title;
    if (description) this.description = description;
    this.color = 0x2ECC40;
    return this;
  }
  addField(name, value, inline) {
    if (!this.fields) this.fields = [];
    let field = {};
    if (name) field.name = name;
    if (value) field.value = value;
    if (inline) field.inline = inline;
    if (field.name) this.fields.push(field);
    return this;
  }
  addColor(color) {
    this.color = color;
    return this;
  }
  addFooter(text, icon) {
    this.footer = {};
    if (text) this.footer.text = text;
    if (icon) this.footer.icon = icon;
    return this;
  }
  addImage(url, height, width) {
    this.image = {};
    this.image.url = url;
    if (height) this.image.height = height;
    if (width) this.image.width = width;
    return this;
  }
  addThumbnail(url, height, width) {
    this.thumbnail = {};
    this.thumbnail.url = url;
    if (height) this.thumbnail.height = height;
    if (width) this.thumbnail.width = width;
    return this;
  }
  addVideo(url, height, width) {
    this.video = {};
    this.video.url = url;
    if (height) this.video.height = height;
    if (width) this.video.width = width;
    return this;
  }
  addAuthor(name, url, icon_url) {
    this.author = {};
    if (name) this.author.name = name;
    if (url) this.author.url = url;
    if (icon_url) this.author.icon_url = icon_url;
    return this;
  }
};
