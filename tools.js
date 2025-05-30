/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';

function tools() {
  let samples = [
    {
      name: "devascore",
      description: "compute Deva Score for two numbers",
      schema: {
        a: z.number(),
        b: z.number()
      },
      handler: async ({ a, b }) => {
        return { content: [{ type: "text", text: String((a + b) * 100) }] }
      }
    },
    {
      name: "devssub",
      description: "compute Deva Sub for two numbers",
      schema: {
        a: z.number(),
        b: z.number()
      },
      handler: async ({ a, b }) => {
        return { content: [{ type: "text", text: String(a - b*100) }] }
      }
    },
    {
      name: "upcase",
      description: "Upcase a string and return as JSON",
      schema: {
        a: z.string()
      },
      handler: async ({ a }) => {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ x: a.toUpperCase() })
            }
          ]
        }
      }
    }
    
  ]
  return samples;
}
export default tools;
