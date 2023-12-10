import { useState, useEffect } from 'react';
import { getPhrase } from '../actions/testActions';
function Testcode() {

  
  const [duplicates, setDuplicates] = useState([]);
  const chineseText ="今天天气非常好,我们要好好地把握时间好好地出去玩一玩。我们可以去公园玩一玩或许可以去郊外踏青。你听到我是谁？如果如果天气继续这么好的话,我们晚上就在外面吃饭. 你听到我是谁？";

  const checkDuplicates = async () => {
    const object = await getPhrase(chineseText)

    const strs = object.phrase_list.phrase.map(p => p.str);

      const wordCounts = {};

      strs.forEach(word => {
        let cleanedWord = word.replace(/[\s,.!?]/g,'');
        if(!wordCounts[cleanedWord]) {
          wordCounts[cleanedWord] = 0; 
        }
        wordCounts[cleanedWord]++;
      });
      
      const duplicates = [];
      
      for(let word in wordCounts) {
        if(wordCounts[word] > 1) {
          duplicates.push(word); 
        }
      }
      
      const filteredWords = duplicates.filter(word => {
        return word && // must not be empty string  
               !/\s|\.|,|\?/.test(word); // no punctuation
      });
      console.log(filteredWords); 
      setDuplicates(filteredWords);
  }



  return (
    <div>
     <button onClick={checkDuplicates}>A</button>
     <p>
        Duplicates: {duplicates.join(", ")}
      </p>
    </div>
  );
}

export default Testcode