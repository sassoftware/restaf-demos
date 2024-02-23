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

import specs from '../gptFunctions/specs.js';
import createAssistant from './createAssistant.js';
import openAssistant from './openAssistant.js';
import {AssistantsClient, OpenAIKeyCredential } from "@azure/openai-assistants";


async function setupAssist(provider, assistanceName) {

  // azureai open includes url and key
  // openai includes key

  let apiKey = (provider === 'openai') ? process.env.OPENAI_KEY : process.env.OPENAI_KEY_AZURE;
  let endpoint = process.env.OPENAI_URL_AZURE;
  let openai = (provider === 'openai') ? new OpenAI({ apiKey: apiKey }) : 
        new AssistantsClient(endpoint,new AzureKeyCredential(apiKey));
   
  console.log(openai);
  //setup control information
  let {tools , functionList} = specs(); 

 // Check if assistant exists(otherwise create it)
  const myAssistants = await openai.beta.assistants.list({
    order: "desc",
    limit: "20",
  });
  let name = (assistanceName == null || assistanceName.trim().length === 0 ) ? "SAS_Assistant" : assistanceName;
  let assistant = myAssistants.data.find((a) => { 
    if (a.name === name) {
      return a;
    }
  });

  // Either create a new assistant or reuse the existing one(preferred)
  let gptControl = (assistant == null) 
                     ? await createAssistant(openai, name, tools)
                     : await openAssistant(openai, assistant);
  gptControl.functionList = functionList;
  return gptControl;

  }
  export default setupAssist;