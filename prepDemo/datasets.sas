cas mycas;
proc cas;
 table.droptable /
      caslib="Public" name="CARS"  quiet=true;
  /* promote the table to make it available for further analysis */
table.loadTable status=status r=rc/
caslib="Public",
path="CARS.sashdat",
casout={name="CARS", caslib="Public" promote=True};

 table.droptable /
      caslib="Public" name="ENROLLMENT"  quiet=true;
  /* promote the table to make it available for further analysis */
table.loadTable status=status r=rc/
caslib="Public",
path="ENROLLMENT.sashdat",
casout={name="ENROLLMENT", caslib="Public" promote=True};

 table.droptable /
      caslib="Public" name="BREASTCANCER"  quiet=true;
  /* promote the table to make it available for further analysis */
table.loadTable status=status r=rc/
caslib="Public",
path="BREASTCANCER.sashdat",
casout={name="BREASTCANCER", caslib="Public" promote=True};
run;

table.droptable /
      caslib="Public" name="GIDB_CURRENT"  quiet=true;
  /* promote the table to make it available for further analysis */
table.loadTable status=status r=rc/
caslib="Public",
path="GIDB_CURRENT.sashdat",
casout={name="GIDB_CURRENT", caslib="Public" promote=True};
run;