/**
 * L1, L2の2層のキャッシュ
 * @param {string} cache_name          Cache APIで使用する名前(cacheName)
 * @param {function} parser            responseを受け取ってキャッシュに保存する内容を返すPromiseを返すコールバック関数
 * @param {number} l1_cache_size       L1キャッシュに保持するURL件数
 * @param {number} l2_cache_expiration L2キャッシュの有効期限(ミリ秒)
 */
function LayeredCache(cache_name, parser, l1_cache_size = 1000, cache_expiration = 30 * 86400 * 1000){
  const HEADER_EXPIRATION = "_expire_on";
  const l1_cache = new Map();
  let l2_cache = null;
  let prepared = false;
  
  caches.open(cache_name).then((cs) => {
    l2_cache = cs;
    prepared = true;
  }).catch((e) => {
    console.error("Cache API ERROR");
    // ダミーのCacheオブジェクトを入れておく。
    l2_cache = {
      match: async function(){ return (void 0);},
      put:  async function(){ return (void 0);},
      delete:  async function(){ return true;}
    };
    prepared = true;
  });
  
  /**
   * 指定したURLのデータをparser関数で処理した結果を返す。
   * L1にあればL1キャッシュからparserで処理済みの結果を返し、
   * 有効期限内のL2キャッシュ(Cache API)があれば、再度parser関数で処理して返す。
   * @param {string} url
   * @return {Promise}
   */
  this.fetch = async function(url){
    let data = null;
    let fetch_flag = false;
    let l1_update_flag = false;
    const now = Date.now();
    let expiration = now + cache_expiration;

    if(!prepared){
      // Cache APIの準備ができていなければ待機
      await new Promise((resolve, reject) => {
        const f = function(){
          if(prepared){
            resolve();
          }else{
            setTimeout(f, 10);
          }
        };
        setTimeout(f, 10);
      });
    }
    
    if(l1_cache.has(url)){
      // L1キャッシュにヒット
      const v = l1_cache.get(url);

      if(now > v.expire_on){
        // L1キャッシュで期限切れ
        fetch_flag = true;
      }else{
        // L1キャッシュの末尾に移動(LRU)
        l1_cache.delete(url);
        l1_cache.set(url, v);
        data = v.data;
      }

    }else{
      const response = await l2_cache.match(url);
      
      if((response === undefined)
        || response.headers.get(HEADER_EXPIRATION) === null
        || (now > Number.parseInt(response.headers.get(HEADER_EXPIRATION)))){
        // L2キャッシュにない場合、またはL2キャッシュが期限切れの場合
        fetch_flag = true;
      }else{
        data = await parser(response);
        expiration = Number.parseInt(response.headers.get(HEADER_EXPIRATION));
        
        l1_update_flag = true;
      }
    }
    
    if(fetch_flag){
      // 通信して取得する
      const response = await fetch(url);
      
      const copy = response.clone();
      const headers = new Headers(copy.headers);
      headers.append(HEADER_EXPIRATION, expiration);
      
      const body = await copy.blob();
      
      await l2_cache.put(url, new Response(body, {
        status: copy.status,
        statusText: copy.statusText,
        headers: headers
      }));
      
      data = await parser(response);
      l1_update_flag = true;
    }
    
    if(l1_update_flag){
      // L1キャッシュの末尾に保存
      l1_cache.set(url, {
        data: data,
        expire_on: expiration
      });
      if(l1_cache.length > l1_cache_size){
        l1_cache.delete(l1_cache.keys().next().value);
      }
    }
    
    return data;
  };
  
  return this;
}
