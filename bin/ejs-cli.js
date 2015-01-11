#!/usr/bin/env node
'use strict';

( function () {
var mQ = require( 'q' );
var mFs = require( 'fs' );
var mEjs = require( 'ejs' );

var tmplPath = process.argv[2];
var dataPath = process.argv[3];

mQ.all( [
    mQ.nfcall( mFs.readFile, tmplPath, 'utf-8' )
    , mQ.nfcall( mFs.readFile, dataPath, 'utf-8' )
  ] )
  .then( function ( data ) {
    // try convert data's file content to json format
    try { data[1] = JSON.parse( data[1] ) }
    catch ( err ) {}
    
    console.log( 
      mEjs.render( 
        data[0]
        , { data : JSON.parse( data[1] ) }
      )
    );
  } )
  .catch( function ( err ) { 
    console.log ( err.message );
  } );
} ) () ;