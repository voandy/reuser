function getStars(starCount){
  switch(true) {
    case (starCount<1):
      return "images/review/stars/0.png";
    case (starCount<1.25):
      return "images/review/stars/1.png";
    case (starCount<1.75):
      return "images/review/stars/1h.png";
    case (starCount<2.25):
      return "images/review/stars/2.png";
    case (starCount<2.75):
      return "images/review/stars/2h.png";
    case (starCount<3.25):
      return "images/review/stars/3.png";
    case (starCount<3.75):
      return "images/review/stars/3h.png";
    case (starCount<4.25):
      return "images/review/stars/4.png";
    case (starCount<4.75):
      return "images/review/stars/4h.png";
    default:
      return "images/review/stars/5.png";
  }
}
