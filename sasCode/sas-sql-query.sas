* 
* template for handling sql statements in args
*
data _null_;
    length sql_final $5000.;
        sql_final="%superq(sql)";
        call symput("sql_final",sql_final);       
    run;

filename joutput filesrvc parenturi="&SYS_JES_JOB_URI" name="query_results.json";

%macro run_sql_code;    

    proc sql;
     create table work.query_results as
     &sql_final.;
    quit;

    proc print data=work.query_results;run;
    
    proc json out= joutput nosastags;
    export query_results;
    run;
%mend;

%run_sql_code;
