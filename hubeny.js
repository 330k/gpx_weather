/**
 * Hubeny測地線距離計算式(標準)
 * https://amano-tec.com/apps/paceruler.html
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @return {number} distance [m]
 */
function hubeny(lat1, lon1, lat2, lon2){
  "use strict";
  const a = 6378137.0;
  const f = 1 / 298.257223563;
  const e2 = f * (2 - f);
  const e2p = e2 / (1 - e2);
  const degree = Math.PI / 180.0;
  const sin = Math.sin;
  const cos = Math.cos;
  const tan = Math.tan;
  const sqrt = Math.sqrt;
  
  const latdiff = (lat1 - lat2) * degree;
  const londiff = (((lon1 - lon2 + 180) % 360) - 180) * degree;
  const latave = 0.5 * (lat1 + lat2) * degree;
  const sinlatave = sin(latave);
  const coslatave = cos(latave);
  const w2 = 1.0 - sinlatave * sinlatave * e2;
  const n = a / sqrt(w2);
  const eta2 = e2p * coslatave * coslatave;
  const eta4 = eta2 * eta2;
  const eta6 = eta2 * eta4;
  const t = tan(latave);
  const t2 = t * t;
  const t4 = t2 * t2;
  const t6 = t2 * t4;
  const latdiff2 = latdiff * latdiff;
  const latdiff3 = latdiff * latdiff2;
  const latdiff4 = latdiff * latdiff3;
  const latdiff5 = latdiff * latdiff4;
  const latdiff6 = latdiff * latdiff5;
  const londiff2 = londiff * londiff;
  const londiff3 = londiff * londiff2;
  const londiff4 = londiff * londiff3;
  const londiff5 = londiff * londiff4;
  const londiff6 = londiff * londiff5;
  const londiff7 = londiff * londiff6;
  const coslatave2 = coslatave * coslatave;
  const coslatave3 = coslatave * coslatave2;
  const coslatave4 = coslatave * coslatave3;
  const coslatave5 = coslatave * coslatave4;
  const coslatave6 = coslatave * coslatave5;
  const coslatave7 = coslatave * coslatave6;

  const ss = n * coslatave * londiff
    + (n * coslatave  /      24) * (1 - eta2 + eta4 - eta6 - 9 * t2 * eta2 + 18 * t2 * eta4 - 27 * t2 * eta6) * latdiff2 * londiff
    + (n * coslatave3 /      24) * (-t2) * londiff3
    + (n * coslatave  /    5760) * (7 + 10 * eta2 - 27 * eta4 - 54 * t2 * eta2 - 642 * t2 * eta4 + 675 * t2 * eta6) * latdiff4 * londiff
    + (n * coslatave3 /    5760) * (-16 - 70 * t2 - 158 * t2 * eta2 + 158 * t2 * eta4 + 90 * t4 * eta2 - 180 * t4 * eta4) * latdiff2 * londiff3
    + (n * coslatave5 /    5760) * (-24 * t2 + 3 * t4 - 27 * t2 * eta2) * londiff5
    + (n * coslatave  / 1935360) * 62 * latdiff6 * londiff
    + (n * coslatave3 / 1935360) * (-416 - 2954 * t2) * latdiff4 * londiff3
    + (n * coslatave5 / 1935360) * (-192 - 1680 * t2 + 2652 * t4) * latdiff2 * londiff5
    + (n * coslatave7 / 1935360) * (-816 * t2 + 528 * t4 - 6 * t2) * londiff7;
  const sc = n / (1 + eta2) * latdiff
    + (n              /      24) * (3 * eta2 - 6 * eta4 + 9 * eta6 - 3 * t2 * eta2 + 21 * t2 * eta4 - 54 * t2 * eta6) * latdiff3
    + (n * coslatave2 /      24) * (-2 - 3 * t2 + 3 * t2 * eta2 - 3 * t2 * eta4 + 3 * t2 * eta6) * latdiff * londiff2
    + (n              /    5760) * (-36 * eta2 + 207 * eta4 + 36 * t2 * eta2 - 1062 * t2 * eta4 + 135 * t4 * eta4) * latdiff5
    + (n * coslatave2 /    5760) * (-16 - 60 * t2 + 4 * eta2 - 4 * eta4 + 102 * t2 * eta2 + 48 * t2 * eta4 + 90 * t4 * eta2 - 630 * t4 * eta4) * latdiff3 * londiff2
    + (n * coslatave4 /    5760) * (-8 - 20 * t2 + 15 * t4 - 8 * eta2 + 96 * t2 * eta2 - 15 * t4 * eta2 + 15 * t4 * eta4) * latdiff * londiff4
    + (n * coslatave2 / 1935360) * (-192 - 2016 * t2) * latdiff5 * londiff2
    + (n * coslatave4 / 1935360) * (256 + 784 * t2 + 4200 * t4) * latdiff3 * londiff4
    + (n * coslatave6 / 1935360) * (-64 - 224 * t2 + 1148 * t4 - 42 * t6) * latdiff * londiff6;
  return sqrt(ss * ss + sc * sc);
}
