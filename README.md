# Examples of integrating gpt into SAS Viya apps

This repository contains examples of integrating gpt into application targeting
 SAS Viya.
The purpose is to demonstrate that integrating the power of gpt into one's own 
application is not rocket-science = the credit goes to the simplicity 
and elegance of the gpt api.

Since the key audience for this repository is SAS customers the examples are 
focused on integrating gpt into applications for SAS Viya.

Watch this repository for more examples.

---

## Table of Contents

---

- [Data Points](#datapoint)
- [Running as a cli](#gpt)

The code is in <https://github.com/sassoftware/restaf-demos/tree/gpt-samples>
There are a few examples of using the gpt api that I created to understand how to
 build apps with gpt and Viya.
You might find them useful.

To clone the repository and run it locally, follow the instructions below.

- [Installation and setup](#install)
- [Basic example](#basic)
- [Basic example with access to Viya](#basicSAS)

---;

## Data Points<a name="datapoint"></a>

---

1. gpt-4 version is used in this repo.
   - if you are using a different version, search the repo for gpt-4 and change 
   it to your version
2. It is the user's reponsibility to get the api key for openai.
   - The samples assume that the key is available as enviroment variable APPENV_USERKEY
3. Most examples make use of SAS REST API to access SAS Viya. The applications
use @sassoftware/restaf, @sassoftware/restaflib and @sassoftware/restafedit to
make these calls. See <https://sassoftware.github.io/restaf/> 
for more information.
4. The source code in this repository is provided under
 Apache-2.0 licensing model.

### Environment Variables

- VIYA_SERVER - Set the value of this env variable to the url for your
Viya Server
- SASTOKEN - For nodejs applications this should have the location of
the authentication information created by executing the following command.
 If the environment variable is not set, then it will default .sas/credentials
  in your home directory.
  - sas-viya auth login|loginCode.
- APPENV_USERKEY - Set to the api key from openai
- VIYASOURCE - set this to either cas, compute or none. Defaults to cas. Used in
prompts that access Viya resources. Use none if you want to use it
 without accessing Viya.

---

## Running as a cli<a name="gpt"> </a>

---

This is interactive gpt session.
After setting the environment variables listed above, start the application as 
follows:

```text
npx @sassoftware/gpt-samples@latest

On the prompt, enter **gpt** to start the gpt session

Enter **help** to get guidance on what is possible


```

The gpt session will stay active until you enter **exit**

To exit the cli enter **exit** again.

## Installation and Setup<a name="install"></a>

The instruction below is for those users who wish to clone the code and extend the application.

- git clone https://github.com/sassoftware/restaf-demos gpt-samples -b gpt-samples
- cd gpt-samples
- npm install
- Define the environment variables described below

## Getting started - Basic example<a name="basic"></a>

This example demonstrates setting up access to gpt and defining a function called
 basic. This function's sole purpose is to reformat user provided keywords as 
 html, array or JavaScript object.
The code is in ./packages/basic/index.js


### Usage

```text
npm run basic <some text>
```

Some sample prompt and results:

### what is SAS Viya

```text
SAS Viya is a cloud-based, in-memory analytics engine from SAS Institute, an American multinational developer of analytics software. SAS Viya provides quick, accurate results and reveals valuable insights from large amounts of data. It's capable of machine learning, text analytics, forecasting, optimization, and statistics. It can be used through a variety of programming languages including Python, R, Java, and Lua, or through its visual interface.
```

### keywords

```text
Sure, can you provide me with the keywords you want to process?
```

### keywords a,b,c as array

```javascript
[ 'a', 'b', 'c' ]
```

### keywords a,b,c as html

```text

<ul><li>a</li><li>b</li><li>c</li></ul>

```

## Example with access to Viya<a name="basicSAS"></a>

This is similar to the previous example The  basic function now executes SAS code 
or casl code.

The prompt should look something like this:

```text

run file path to your .sas file or .casl file

```

The following starter files are included. Use .sas files if env VIYASOURCE is set to compute

- ../programs/echo.casl
- ../programs/datastep.casl
- ../programs/datastep.sas  

### Usage for SAS example

```text
npm run basicSAS "run file <some path>"
```

### run  file ../programs/datastep.casl

```json
{
    "casResults": {
        "result": {
            "Fetch": {
                "_ctb": true,
                "attributes": {
                    "Action": {
                        "type": "string",
                        "value": "fetch"
                    },
                    "Actionset": {
                        "type": "string",
                        "value": "table"
                    },
                    "CreateTime": {
                        "type": "double",
                        "value": 2022787095.92428
                    }
                },
                "label": "Selected Rows from Table A",
                "name": "Fetch",
                "rows": [
                    [
                        1,
                        1
                    ]
                ],
                "schema": [
                    {
                        "attributes": {},
                        "format": "",
                        "label": "",
                        "name": "_Index_",
                        "type": "int",
                        "width": 8
                    },
                    {
                        "attributes": {},
                        "format": "",
                        "label": "",
                        "name": "x",
                        "type": "double",
                        "width": 8
                    }
                ],
                "title": "Selected Rows from Table A"
            }
        }
    }
}

```

### run file ../programs/datastep.sas

```json
[
    {
        "line": "1    options NOSYNTAXCHECK OBS=MAX;%let syscc=0;",
        "type": "source",
        "version": 1
    },
    {
        "line": "2    data a;",
        "type": "source",
        "version": 1
    },
    {
        "line": "3      x=1;",
        "type": "source",
        "version": 1
    },
    {
        "line": "4    run;",
        "type": "source",
        "version": 1
    },
    {
        "line": "",
        "type": "note",
        "version": 1
    },
    {
        "line": "NOTE: The data set WORK.A has 1 observations and 1 variables.",
        "type": "note",
        "version": 1
    },
    {
        "line": "NOTE: DATA statement used (Total process time):",
        "type": "note",
        "version": 1
    },
    {
        "line": "      real time           0.00 seconds",
        "type": "note",
        "version": 1
    },
    {
        "line": "      cpu time            0.00 seconds",
        "type": "note",
        "version": 1
    },
    {
        "line": "      ",
        "type": "note",
        "version": 1
    },
    {
        "line": "",
        "type": "note",
        "version": 1
    },
    {
        "line": "5    ",
        "type": "source",
        "version": 1
    },
    {
        "line": "6    proc print; run;",
        "type": "source",
        "version": 1
    },
    {
        "line": "",
        "type": "note",
        "version": 1
    },
    {
        "line": "NOTE: There were 1 observations read from the data set WORK.A.",
        "type": "note",
        "version": 1
    },
    {
        "line": "NOTE: The PROCEDURE PRINT printed page 1.",
        "type": "note",
        "version": 1
    },
    {
        "line": "NOTE: PROCEDURE PRINT used (Total process time):",
        "type": "note",
        "version": 1
    },
    {
        "line": "      real time           0.05 seconds",
        "type": "note",
        "version": 1
    },
    {
        "line": "      cpu time            0.06 seconds",
        "type": "note",
        "version": 1
    },
    {
        "line": "      ",
        "type": "note",
        "version": 1
    },
    {
        "line": "",
        "type": "note",
        "version": 1
    },
    {
        "line": "7    ",
        "type": "source",
        "version": 1
    },
    {
        "line": "8    ;",
        "type": "source",
        "version": 1
    },
    {
        "line": "",
        "type": "note",
        "version": 1
    }
]


```
