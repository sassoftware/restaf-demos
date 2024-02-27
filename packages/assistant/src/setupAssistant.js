/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
/**
 * @async
 * @function setupAssist
 * @description   Setup the GPT Assistant
 * @param {string} provider - azure or openai
 * @param {string} assistanceName - name of the assistant(default is SAS_Assistant)
 * @returns {promise} - return {openai, assistant, thread, functionList}
 */
import OpenAI from 'openai';  
import  {OpenAIClient, OpenAIKeyCredential} from '@azure/openai'

import createAssistant from './createAssistant.js';
import openAssistant from './openAssistant.js';
import setupViya from '../lib/setupViya.js';

async function setupAssistant(config) {

  // azureai open includes url and key
  // openai includes key
  let {provider, assistantName, credentials} = config;
 // let apiKey = (provider === 'openai') ? process.env.OPENAI_KEY : process.env.OPENAI_AZ_KEY;
  let apiKey = (provider === 'openai') ? credentials.openaiKey : credentials.azureaiKey;
  let endpoint = credentials.azureaiEndpoint;
  let openai = (provider === 'openai') ? new OpenAI({ apiKey: apiKey }) : 
        new OpenAIClient(endpoint, new OpenAIKeyCredential(apiKey));

 // Wishlist: Wish could open with query of name and let it succeed or fail
  const myAssistants = await openai.beta.assistants.list({
    order: "desc",
    limit: "100",
  });
  let assistant = myAssistants.data.find((a) => { 
    if (a.name === assistantName) {
      return a;
    }
  });

  // Either create a new assistant or reuse the existing one(preferred)
  
  let gptControl = (assistant == null) 
                     ? await createAssistant(openai, config)
                     : await openAssistant(openai, assistant, config);
                     
  // setup viya session
  let appEnv = await setupViya(config.source);
  return {gptControl, appEnv};

  }
  export default setupAssistant;