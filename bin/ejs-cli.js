#!/usr/bin/env node
'use strict';

( function () {
var mQ = require( 'q' );
var mFs = require( 'fs' );
var mEjs = require( 'ejs' );
var mPath = require( 'path' );
var mThrough = require('through');

var pkgObj = require( '../package' );
var option = process.argv[2];

switch ( option ) {
  case '-v' : 
    console.log( pkgObj.version ); 
    break;
  case '-h' : 
    mFs.readFile(
      mPath.join( mPath.dirname(process.argv[1]), '../help' )
      , function (err, data) {
        if (err) throw err;
        console.log(data.toString());
      }
    );
    break;
  case '-i' : 
    process.stdin.setEncoding('utf8');
    var content = '';
    process.stdin.on('data', function( chunk ) { content += chunk.toString(); } );
    process.stdin.on('end', function () {
      mFs.readFile( process.argv[3], 'utf-8', function ( err, data ) {
        if (err) throw err;
        console.log( template( data, content ) );
      } );
    } );
    break;
  case '-f' : 
    mQ.all( [
      mQ.nfcall( mFs.readFile, process.argv[3], 'utf-8' )
      , mQ.nfcall( mFs.readFile, process.argv[4], 'utf-8' )
    ] )
    .then( function ( data ) { console.log( template( data[0], data[1] ) ); } )
    .catch( function ( err ) { console.log ( err.message ); } );
    break;
}

function template ( tmpl, data ) {
  // try convert data's file content to json format
  try { data = JSON.parse( data ) } catch ( err ) {}
  return mEjs.render( tmpl, { data : data } );
}

} ) () ;