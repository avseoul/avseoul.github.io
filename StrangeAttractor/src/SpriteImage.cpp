//
//  SpriteImage.cpp
//  StrangeAttractor
//
//  Created by av's macbook pro on 3/28/15.
//
//

#include "SpriteImage.h"

SpriteImage::SpriteImage(int _type){
    if(_type == 0){
        mSprite = gl::Texture::create( loadImage( loadResource( RES_SPRITE ) ) );
    } else if(_type == 1){
        mSprite = gl::Texture::create( loadImage( loadResource( RES_SPRITE_02 ) ) );
    } else if(_type == 2){
        mSprite = gl::Texture::create( loadImage( loadResource( RES_SPRITE_03 ) ) );
    }
    
    float mRandomValue = randFloat(10, 30);
    mSize.x = mRandomValue;
    mSize.y = mRandomValue;
}

void SpriteImage::addLoc(Vec3f _loc){
    mLocs.push_back(_loc);
}

void SpriteImage::render(Vec3f _mRight, Vec3f _mUp){
    mRight = _mRight;
    mUp = _mUp;
    
    update();
    display();
}

void SpriteImage::update(){
    float sinValue, cosValue, offset, count;
    count = getElapsedFrames();
    offset = 3;
    sinValue = sin( count ) * offset;
    cosValue = cos( count ) * offset;
    
    mSize.x += sinValue;
    mSize.y += cosValue;
}

void SpriteImage::display(){
    gl::enableAlphaBlending();
//    glBlendFunc(GL_ONE, GL_ONE_MINUS_SRC_ALPHA);
    gl::pushMatrices();
    {
        mSprite->enableAndBind();
        int num = mLocs.size();
        
        for(int i = 0; i < num; i++){
            gl::translate(mLocs[i]);
            gl::rotate(Vec3f(0, rotateY, 0));
            glNormal3f( 0, 0, -1);
//            mSprite->enableAndBind();

            gl::drawBillboard(Vec3f::zero(), mSize, 0, mRight, mUp);
//            mSprite->unbind();

        }
        mSprite->unbind();
    }
    gl::popMatrices();
    gl::disableAlphaBlending();
    rotateY += 0.6;
}