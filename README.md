# files_zenodo
Zenodo integration for ownCloud

Written 2016 by Lars Næsbye Christensen, DeIC

Allows you to send files in compressed form to Zenodo (zenodo.org), including metadata. 

## Dependencies 
 * The **files_compress** app for compressing folders into a tarball
 * The **meta_data** app for accessing metadata tags
 * ownCloud 7 (not tested with 8)

## Installation instructions
Copy the app files to the **owncloud/apps/** directory. Make sure the server can write to the user directory - this is needed for temporary files courtesy of the files_compress app.

## Usage
You will need a Zenodo access token in order to send anything to Zenodo. Go to zenodo.org to learn how to create one.
This token must be entered under your personal user settings in ownCloud -> User -> AppSettings -> Zenodo.

