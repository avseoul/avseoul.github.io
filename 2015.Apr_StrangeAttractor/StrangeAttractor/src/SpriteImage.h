//
//  SpriteImage.h
//  StrangeAttractor
//
//  Created by av's macbook pro on 3/28/15.
//
//

#pragma once

#include <stdio.h>
#include "cinder/ImageIo.h"
#include "cinder/gl/Texture.h"
#include "Resources.h"
#include "cinder/Rand.h"

using namespace ci;
using namespace ci::app;

class SpriteImage{
public:
    SpriteImage(int _type);
    
    void            render(Vec3f _mRight, Vec3f _mUp);
    void            update();
    void            display();
    void            addLoc(Vec3f _loc);
    
    gl::TextureRef  mSprite;
    
    Vec2f           mSize;
    Vec3f           mRight, mUp;
    
    std::vector<Vec3f>   mLocs;
    
    float           rotateY;
};
