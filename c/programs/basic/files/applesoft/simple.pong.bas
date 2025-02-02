0 REM
1 REM Newsgroups: comp.sys.apple2
2 REM From:  mad.scientist.jr@gmail.com
3 REM Message-ID: <1193160910.224728.270640@z24g2000prh.googlegroups.com>
4 REM Subject: Re: woz' original "brick out" - source code , paddles
5 REM Date: Tue, 23 Oct 2007 17:35:10 -0000
6 REM

10   REM  APPLE II SIMPLE PONG V4
20   REM  PASTE INTO Joshua Bell s EMULATOR AT www.calormen.com/Applesoft/
25   REM  ++++++++++++++++++++++++++++++++++++++++
30   REM  TITLE SCREEN + PROMPT FOR CONTROLS
35   REM  ++++++++++++++++++++++++++++++++++++++++
40   TEXT : REM ENTER TEXT MODE
45   HOME : REM CLEAR TEXT SCREEN
49   PRINT "APPLE II SIMPLE PONG V4"
50   PRINT
51   PRINT "version 1 by aiiadict"
52   PRINT "tweaks by Mad Scientist Jr"
54   PRINT
55   PRINT "During game press Q to quit."
56   PRINT
58   INPUT "TYPE K FOR KEYS (A/Z, K/M) OR P FOR PADDLES OR Q TO QUIT? ";C$
60   IF C$ <> "K" AND C$ <> "P" AND C$ <> "Q" THEN GOTO 58
62   IF C$ = "Q" THEN GOTO 9000
65   REM
70   REM  ++++++++++++++++++++++++++++++++++++++++
75   REM  DRAW FIELD AND INITIALIZE GAME
80   REM  ++++++++++++++++++++++++++++++++++++++++
85   GR: REM ENTER GRAPHIC MODE
90   COLOR= 7: VLIN 0,39 AT 0: VLIN 0,39 AT 39
95   HLIN 0,39 AT 0: HLIN 0,39 AT 39
100  bx = 10:by = 10:ox = 10:oy = 10: REM BALL START POSITION
102  dx = 1: dy = - 1: REM BALL DIRECTION
104  p1 = 10: o1 = 10: REM PLAYER 1 START POSITION
106  p2 = 10: o2 = 10: REM PLAYER 2 START POSITION
120  PL = 8: REM PADDLE LENGTH
130  REM
145  REM  ++++++++++++++++++++++++++++++++++++++++
150  REM  BEGIN MAIN GAME LOOP
155  REM  ++++++++++++++++++++++++++++++++++++++++
196  REM  ++++++++++++++++++++++++++++++++++++++++
197  REM  DRAW PADDLE1
198  REM  ++++++++++++++++++++++++++++++++++++++++
200  IF o1 <> p1 THEN COLOR= 0: VLIN o1,o1 + PL AT 3
210  COLOR= 7: VLIN p1,p1 + PL AT 3
296  REM  ++++++++++++++++++++++++++++++++++++++++
297  REM  DRAW PADDLE2
298  REM  ++++++++++++++++++++++++++++++++++++++++
300  IF o2 <> p2 THEN COLOR= 0: VLIN o2,o2 + PL AT 36
310  COLOR= 7: VLIN p2,p2 + PL AT 36
399  REM  ++++++++++++++++++++++++++++++++++++++++
400  REM  DRAW AND MOVE BALL
401  REM  ++++++++++++++++++++++++++++++++++++++++
402  IF ox <> bx OR oy <> by THEN COLOR= 0: PLOT ox,oy: PLOT ox,oy + 1
410  COLOR= 5: PLOT bx,by: PLOT bx,by + 1
416  ox = bx:oy = by
830  bx = bx + dx
835  IF  SCRN( bx,by) > 0 THEN dx =  - dx
840  by = by + dy
845  IF  SCRN( bx,by) > 0 THEN dy =  - dy
850  IF bx < 1 THEN bx = 1
860  IF bx > 38 THEN bx = 38
870  IF by < 1 THEN by = 1
880  IF by > 38 THEN by = 38
881  REM
882  REM  ----------------------------------------
883  REM  SAVE OLD SCREEN POSITION
884  REM  ----------------------------------------
885  o1 = p1
886  o2 = p2
889  REM
900  REM  ++++++++++++++++++++++++++++++++++++++++
901  REM  GET PLAYER INPUT
902  REM  ++++++++++++++++++++++++++++++++++++++++
903  IF PEEK ( - 16384) > 127 THEN GET K$: REM SEE IF KEY(S) PRESSED. NEEDS FIX FOR MULTI KEY SIMULTANEOUS INPUT
904  IF C$ <> "K" THEN GOTO 921
905  REM
906  REM  ----------------------------------------
907  REM  KEYBOARD INPUT
908  REM  NOTE: NEEDS FIX TO DETECT MULTI KEYPRESSES
909  REM  ----------------------------------------
912  IF K$ = "A" THEN p1 = p1 - 1
914  IF K$ = "Z" THEN p1 = p1 + 1
916  IF K$ = "K" THEN p2 = p2 - 1
918  IF K$ = "M" THEN p2 = p2 + 1
920  GOTO 955
921  IF C$ <> "P" THEN GOTO 947
922  REM
923  REM  ----------------------------------------
925  REM  PADDLE INPUT
927  REM  ----------------------------------------
930 REM simple (non-absolute) paddle input:
931 REM if pdl(0) > 200 then p1 = p1 + 1
932 REM if pdl(0) < 55 then p1 = p1 - 1
933 REM if pdl(1) > 200 then p2 = p2 + 1
934 REM if pdl(1) < 55 then p2 = p2 - 1
943 REM realtime (absolute position) paddle input:
944 GOSUB 3000: REM PLAYER 1
945 GOSUB 4000: REM PLAYER 2
947  REM
948  REM  ----------------------------------------
949  REM  SEE IF PLAYER PRESSED Q TO QUIT
950  REM  ----------------------------------------
951  IF K$ = "Q" THEN GOTO 9000
954  REM
955  REM  ++++++++++++++++++++++++++++++++++++++++
956  REM  MAKE SURE PADDLES DONT GO OFF SCREEN
958  REM  ++++++++++++++++++++++++++++++++++++++++
960  IF p1 < 2 THEN p1 = 2
970  IF p1 > 28 THEN p1 = 28
980  IF p2 < 2 THEN p2 = 2
990  IF p2 > 28 THEN p2 = 28
1000 REM
1010 REM  ++++++++++++++++++++++++++++++++++++++++
1020 REM  CONTINUE GAME LOOP
1030 REM  ++++++++++++++++++++++++++++++++++++++++
1040  GOTO 150
3000 REM
3010 REM  ++++++++++++++++++++++++++++++++++++++++
3020 REM  GET SCREEN POSITION FROM PADDLE 1 INPUT
3030 REM  ++++++++++++++++++++++++++++++++++++++++
3040 p1 = 26 * pdl(0)
3050 p1 = p1 / 255
3060 p1 = p1 + 2
3070 RETURN
4000 REM
4010 REM  ++++++++++++++++++++++++++++++++++++++++
4020 REM  GET SCREEN POSITION FROM PADDLE 2 INPUT
4030 REM  ++++++++++++++++++++++++++++++++++++++++
4040 p2 = 26 * pdl(1)
4050 p2 = p2 / 255
4060 p2 = p2 + 2
4070 RETURN
9000 REM
9010 REM  ++++++++++++++++++++++++++++++++++++++++
9020 REM  QUIT GAME
9030 REM  ++++++++++++++++++++++++++++++++++++++++
9040  TEXT : REM HOME
9045  PRINT
9050  PRINT "FINISHED APPLE II SIMPLE PONG V4."
9060  END