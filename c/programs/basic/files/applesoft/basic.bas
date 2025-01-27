5 PR#3 : TEXT : HOME
10 PRINT "(1) GOSUB/RETURN/POP"
15 PRINT "(2) Basic I/O, IF/THEN"
20 PRINT "(3) Fibbonacci Sequence"
25 PRINT "(4) Guess my number"
30 PRINT "(5) Guess your number"
35 PRINT "(6) Approximate Pi"
40 PRINT "(7) Function tests"
45 PRINT "(8) Error tests"
50 PRINT "(9) Cellular automata"
55 PRINT "(10) Madlibs"
60 PRINT "(11) Lissajous Figures"
65 PRINT "(12) Screen Test"
70 PRINT "(13) DOS Sequential Access"
75 PRINT "(14) Lores Drawing with Joystick"
80 PRINT "(15) Lores Colors"
85 PRINT "(16) Mandelbrot Set"
85 PRINT "(17) Light Cycles"
90 PRINT "(18) Hires Demo"
92 PRINT "(19) DOS WRITE/APPEND"
94 PRINT "(20) ONERR ... RESUME"
94 PRINT "(21) CHR$ Tests"
95 PRINT: INPUT "Enter option: "; A : PRINT : HOME : ON A GOTO 100,200,300,400,500,600,700,800,1900,1000,1100,1200,2000,2100,2200,2300,2400,2500,2600,2700,2800
98 HOME
99 END

100 REM Gosub/Pop/Return tests
110 TRACE : PRINT "GOSUB 150" : GOSUB 150
120 PRINT "GOSUB 160" : GOSUB 160
130 PRINT : PRINT "Press any key: " : GET A$ : GOTO 5
150 PRINT "RETURN" : NOTRACE : RETURN
160 PRINT "GOSUB 190" : GOSUB 190
180 PRINT "RETURN - Shouldn't happen!"
190 PRINT "POP" : POP : PRINT "RETURN" : RETURN

200 REM Basic input/output, expression, IF/THEN tests
205 PRINT "at line 200" 
210 INPUT "Pick a number: "; A
215 PRINT A
220 IF (A) THEN PRINT "TRUE" 
230 IF (NOT A) THEN PRINT "FALSE"
240 PRINT : PRINT "Press any key: " : GET A$ : GOTO 5

300 REM Fibbonacci
310 LA = 0 : CU = 1
320 NX = LA + CU : PRINT NX 
330 LA = CU : CU = NX
340 GOTO 320

400 REM Guess my number
405 PRINT "I'm picking a number between 1 and 100..."
410 N = INT( RND(1) * 100 ) + 1
420 INPUT "Your guess? "; G
430 IF G = N THEN PRINT "Got it!" : PRINT : PRINT "Press any key: " : GET A$ : GOTO 5
430 IF G < N THEN PRINT "Too low" : GOTO 420
440 IF G > N THEN PRINT "Too high" : GOTO 420

500 REM Guess your number
510 INPUT "Pick a number between 1 and 100, then press Enter: "; X
520 MN = 1 : MX = 100: G = INT( RND(1) * 100 ) + 1
530 PRINT "I guess ";G;" - enter 1 for too high, -1 for too low, 0 for got it"
540 INPUT R
550 IF R = 0 THEN PRINT "I guessed right!" : PRINT : PRINT "Press any key: " : GET A$ : GOTO 5
540 IF R < 0 THEN MN = G + 1 : GOTO 560
550 IF R > 0 THEN MX = G - 1 : GOTO 560
560 IF MX = MN THEN PRINT "It must be "; MX; " - I guess you win." : END
570 G = INT( ( MX + MN ) / 2 ) : GOTO 530

600 REM Compute pi
610 I = 0
620 SUM = 0
630 SIGN = 1
640 D = ( SIGN * ( 1 / ( 2 * I + 1 ) ) )
645 SUM = SUM + D
650 SIGN = -SIGN
660 PI = 4 * SUM
670 PRINT "I = ";I;"   PI = ";PI;"  D = ";D
680 I = I + 1
690 GOTO 640

700 REM Function tests
702 PRINT "ABS(-3.14)           = "; ABS(-3.14)
704 PRINT "ASC('A')             = "; ASC("A")
706 PRINT "ATN(1)               = "; ATN(1)
708 PRINT "CHR$(65)             = "; CHR$(65)
710 PRINT "COS(1)               = "; COS(1)
712 PRINT "EXP(1)               = "; EXP(1)
714 PRINT "INT(3.14)            = "; INT(3.14)
716 PRINT "LEFT$('abcdef',3)    = "; LEFT$("abcdef",3)
718 PRINT "LEN('abcdef')        = "; LEN("abcdef")
720 PRINT "LOG(3.14)            = "; LOG(3.14)
722 PRINT "MID$('abcdef',3)     = "; MID$("abcdef",3)
724 PRINT "MID$('abcdef',3,2)   = "; MID$("abcdef",3,2)
726 PRINT "RIGHT$('abcdef',3)   = "; RIGHT$("abcdef",3)
728 PRINT "RND(1)               = "; RND(1)
730 PRINT "SGN(-3.14)           = "; SGN(-3.14)
732 PRINT "SIN(1)               = "; SIN(1)
734 PRINT "SQR(9)               = "; SQR(9)
736 PRINT "STR$(3.14)           = "; STR$(3.14)
738 PRINT "TAN(1)               = "; TAN(1)
740 PRINT "VAL('3.14')          = "; VAL("3.14")
790 PRINT : PRINT "Press any key: " : GET A$ : GOTO 5

800 REM Error tests
810 A = 2 / 0 : PRINT "Shouldn't print this!"
820 PRINT : PRINT "Press any key: " : GET A$ : GOTO 5

900 REM Cellular automata
901 PRINT "Wolfram's CA rules" : PRINT "Try 110, 111, 118, 121, 126" : PRINT 
902 INPUT "Rule: "; R : PRINT
904 DIM VT(8) : FOR I = 0 TO 7 : VT(I) = NOT( R / 2 = INT( R / 2 ) ) : R = INT(R / 2) : NEXT
910 S$ = "                  #                  "
912 PRINT ">";S$;"<"
914 N$ = " "
916 FOR I = 2 TO LEN(S$) - 1
918 V = 4 * ( MID$( S$, I-1, 1) = "#" ) + 2 * ( MID$( S$, I, 1) = "#" ) + 1 * ( MID$( S$, I+1, 1) = "#" )
920 IF VT(V) THEN N$ = N$ + "#" : GOTO 930
922 N$ = N$ + " "
930 NEXT I
940 N$ = N$ + " "
950 S$ = N$
960 GOTO 912

1000 REM Madlibs
1010 INPUT "Name: "; N$
1020 INPUT "Verb: "; V$
1030 INPUT "Noun: "; NN$
1040 INPUT "Place: "; P$
1050 S$ = "One day, " + N$ + " " + V$ + " to " + P$ + " to see the " + NN$ + "."
1060 PRINT S$ : PRINT 
1070 PRINT : PRINT "Press any key: " : GET A$ : GOTO 5

1100 REM Lissajous Figures
1105 REM POKE 49168,0 : REM Clear keyboard strobe
1110 XA = 19 : YA = 19
1120 XM = RND(1) * 0.5 + 0.5 : YM = RND(1) * 0.5 + 0.5
1130 P = RND(1) * 3.14159 * 2
1140 GR : COLOR= RND(1) * 14 + 1
1150 FOR T = 0 TO 99 STEP 0.05
1155 IF PEEK(49152) > 127 THEN POKE 49168,0 : GOTO 5
1160 X = XA * COS( XM * T )
1170 Y = YA * COS( YM * T + P )
1180 PLOT 20 + X, 20 + Y
1190 NEXT T : GOTO 1100

1200 REM Screen Coordinates
1210 TEXT: HOME : FOR I = 1 TO 24 : HTAB 1 : VTAB I : PRINT I; : NEXT
1220 GR : FOR I = 0 TO 39 : COLOR= I : HLIN 0, 39 AT I : NEXT
1230 VTAB 24 : HTAB 10 : PRINT "Press Any Key To Continue"; : GET A$
1240 HGR : C = 3 : FOR I = 0 TO 70 : HCOLOR= C : HPLOT I*2,I TO 279-I*2,I TO 279-I*2,159-I TO I*2,159-I TO I*2,I : C = C + 1 : IF C > 7 THEN C = 0
1245 NEXT
1250 VTAB 24 : HTAB 10 : PRINT "Press Any Key To Continue"; : GET A$
1290 GOTO 5

1900 REM Cellular automata
1901 HOME
1902 PRINT "Wolfram's CA rules" : PRINT "Try 110, 111, 118, 121, 126" : PRINT 
1903 INPUT "Rule: "; R : PRINT
1904 DIM VT(8) : FOR I = 0 TO 7 : VT(I) = NOT( R / 2 = INT( R / 2 ) ) : R = INT(R / 2) : NEXT
1910 DIM C(30) : DIM N(30) : N(15) = 1 
1912 FOR I = 0 TO 30 : C(I) = N(I) : PRINT C(I); : NEXT : PRINT
1916 FOR I = 2 TO 30 - 1
1918 V = 4 * C(I-1) + 2 * C(I) + 1 * C(I+1)
1920 N(I) = VT(V)
1930 NEXT I
1940 GOTO 1912

2000 REM DOS Sequential Text File
2005 PRINT "First, knowing it has 4 lines..." : PRINT 
2010 PRINT CHR$(4)"OPEN JABBERWOCKY"
2015 PRINT CHR$(4)"READ JABBERWOCKY"
2020 FOR I = 1 TO 4 : INPUT A$ : PRINT A$ : NEXT
2025 PRINT CHR$(4)"CLOSE"
2030 PRINT : PRINT "Now with ONERR..." : PRINT 
2035 PRINT CHR$(4)"OPEN JABBERWOCKY"
2040 PRINT CHR$(4)"READ JABBERWOCKY"
2045 ONERR GOTO 2055
2050 INPUT A$ : PRINT A$ : GOTO 2050
2055 PRINT : PRINT "Hit EOF " : POKE 216,0 : PRINT CHR$(4)"CLOSE"
2090 PRINT : PRINT "Press any key to continue: " : GET A$ : GOTO 5

2100 REM Lores Drawing
2110 GR
2115 OX = -1 : OY = -1
2116 C = 0
2120 X = INT( PDL(0) / 256 * 40 )
2130 Y = INT( PDL(1) / 256 * 48 )
2135 HTAB 1 : VTAB 23 : PRINT X ; "   " ; Y ; "    "
2140 REM IF ( OX <> X OR OY <> Y )  AND OX <> -1 AND OY <> -1 THEN COLOR= 0 : PLOT OX, OY
2150 COLOR= C : PLOT X, Y
2160 OX = X : OY = Y : C = C + 1 : IF C > 15 THEN C = 0
2170 GOTO 2120

2200 REM Color Chart
2210 GR
2220 DATA 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -1, -1, 10, 11, -1, -1, 12, 13, -1, -1, 14, 15, -2
2230 MX = 0 : MY = 0 : XS = 6 : YS = 9
2240 READ C : IF C = -2 THEN HTAB 1 : VTAB 22 : PRINT "Press any key: " : GET A$ : GOTO 5
2250 IF C = -1 THEN GOTO 2270
2260 COLOR= C : FOR Y = 0 TO YS-1 : HLIN MX*XS,MX*XS+(XS-2) AT MY*(YS+1)+Y : NEXT
2270 MY = MY + 1 : IF MY > 3 THEN MY = 0 : MX = MX + 1
2280 GOTO 2240

2300 REM Mandelbrot Set
2310 HOME : GR : POKE 49234,0
2320 FOR X = 0 TO 39 : FOR Y = 1 TO 24
2330 I = X / 40 * 3 - 2 : J = Y / 48 * 2 - 1
2340 GOSUB 2360 : COLOR= C : PLOT X, Y : PLOT X,48 - Y
2350 NEXT Y : NEXT X : HTAB 1 : VTAB 22 : PRINT "Press any key: " : GET A$ : GOTO 5
2360 IT = 0 : S = I : T = J
2370 S1 = S*S - T*T + I : T = 2*S*T + J: S = S1 : IT = IT + 1
2380 IF ((S*S + T*T) < 4) AND IT < 16 THEN GOTO 2370
2390 C = IT : RETURN

2400 REM Light Cycles Game
2410 HOME : GR : REM TODO: Fullscreen
2420 X = 19 : Y = 38 : DX = 0 : DY = -1
2430 COLOR= 15 : HLIN 0,39 AT 0: HLIN 0,39 AT 39: VLIN 0,39 AT 0 : VLIN 0,39 AT 39
2440 HTAB 1 : VTAB 22 : PRINT "Press any key to start: " : GET A$ : HOME
2450 COLOR= 2: PLOT X,Y
2460 K = PEEK(49152) : POKE 49168,0
2461 LX = DX : LY = DY
2462 IF K =  8+128 THEN DX = -1 : DY =  0
2463 IF K = 21+128 THEN DX =  1 : DY =  0
2464 IF K = 11+128 THEN DX =  0 : DY = -1
2465 IF K = 10+128 THEN DX =  0 : DY =  1
2466 IF ( LX AND LX = -DX ) OR (LY AND LY = -DY) THEN DX = LX : DY = LY
2470 X = X + DX : Y = Y + DY
2480 IF SCRN(X,Y) <> 0 THEN HTAB 1 : VTAB 23 : PRINT "Crashed! Press any key to continue: " :  POKE 49168,0 : GET A$ : GOTO 5
2490 HTAB 1 : VTAB 21 : SC = SC + 10 : PRINT "Score: "; SC
2490 FOR I = 0 TO 500 : NEXT : GOTO 2450

2500 REM Hires Demo
2510 HOME : HGR
2520 W = 279 : H = 159
2530 FOR I = 0 TO 1 STEP 0.05
2535 HCOLOR= 1
2540 HPLOT 0,H * I     TO W* (1-I),0
2545 HCOLOR= 2
2550 HPLOT 0,H * (1-I) TO W* (1-I),H
2555 HCOLOR= 5
2560 HPLOT W,H * I     TO W * I,0
2565 HCOLOR= 6
2570 HPLOT W,H * (1-I) TO W * I,H
2575 NEXT
2580 HTAB 1 : VTAB 22 : PRINT "Press any key to continue: " : GET A$ : GOTO 5

2600 REM DOS WRITE/APPEND
2610 PRINT CHR$(4)"OPEN FOO"
2615 PRINT CHR$(4)"WRITE FOO"
2620 FOR I = 1 TO 5 : PRINT "WRITE - "; CHR$(ASC("A") - 1 + I ) : NEXT
2625 PRINT CHR$(4)"CLOSE FOO"
2630 PRINT CHR$(4)"APPEND FOO"
2635 PRINT CHR$(4)"WRITE FOO"
2640 FOR I = 6 TO 10 : PRINT "APPEND - ";CHR$(ASC("A") - 1 + I ) : NEXT
2645 PRINT CHR$(4)"CLOSE FOO"
2650 PRINT CHR$(4)"OPEN FOO"
2655 PRINT CHR$(4)"READ FOO"
2660 FOR I = 1 TO 10 : INPUT A$ : PRINT "READ LINE ";I;": ";A$ : NEXT
2665 PRINT CHR$(4)"CLOSE FOO"
2670 PRINT : PRINT "Press any key to continue: " : GET A$ : GOTO 5

2700 REM ONERR ... RESUME 
2710 PRINT "First, RESUME into an IF statement"
2712 ONERR GOTO 2718
2714 PRINT "Testing... " : X = 0 : IF 1 / X THEN PRINT "Succeeded!"
2716 PRINT "That worked!" : GOTO 2750
2718 PRINT "Oops! How about this... " : X = 1 : RESUME
2750 ONERR GOTO 2785
2755 PRINT "Trigger division by zero with X / Y"
2760 INPUT "X = ";X
2765 INPUT "Y = ";Y
2770 PRINT "X / Y = ";X;" / ";Y;" = ";(X/Y)
2775 POKE 216,0 : REM Clear ONERR Flag
2780 PRINT "That worked! Press any key to continue: " : GET A$ : GOTO 5
2785 PRINT : PRINT "Oops, caught an error. Try again": INPUT "Y = ";Y : RESUME

2800 REM CONTROL KEY TESTS
2810 PR#0 : TEXT : HOME 
2820 HTAB 20 : VTAB 24 : PRINT "1"CHR$(10)"2";
2830 HTAB 1 : VTAB 11 : PRINT CHR$(8)"3";
2840 HTAB 1 : VTAB 1 : PRINT CHR$(8)"4";
2851 HTAB 16 : VTAB 23 : PRINT "1-->";
2852 HTAB 17 : VTAB 24 : PRINT "2-->";
2853 HTAB 36 : VTAB 10 : PRINT "3-->";
2854 HTAB 36 : VTAB 1 : PRINT "4-->";
2860 VTAB 10 : HTAB 1 : PRINT "Press key to beep:"; : GET A$ : PRINT CHR$(7)
2870 VTAB 11 : HTAB 1 : PRINT "Press any key:"; : GET A$ : GOTO 5



