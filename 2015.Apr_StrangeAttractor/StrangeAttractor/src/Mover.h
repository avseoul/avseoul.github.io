//
//  Mover.h
//  StrangeAttractor
//
//  Created by av's macbook pro on 3/6/15.
//
//

#pragma once

#include <stdio.h>
#include "cinder/BSpline.h"
#include "cinder/Rand.h"
#include "cinder/Perlin.h"

#include "SpriteImage.h"

using namespace::std;
using namespace::ci;
using namespace::ci::app;
using namespace::cinder;

class Mover{
public:
    Mover(int _index);
    
    void                update(Vec3f _loc);
    void                buildBSpline();
    void                addLocToArray(Vec3f _loc);
    void                getSplineShape(Vec3f _loc);
    void                calUpdateLocs(float _sinCount);
    void                drawMover();
    void                drawGLLine();
    void                drawRandomPoint(Vec3f _mRight, Vec3f _mUp);
    
    int                 indexCount;
    float               randSinCount;
    int                 GLLineIndex;
    
    Vec3f               loc;
    vector<Vec3f>       curve;
    vector<Vec3f>       mSplineShape;
    vector<Vec3f>       mLocs;
    
    Perlin              mPerlin;
    
    SpriteImage*         mSpriteImage;
};

