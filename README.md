# files_zenodo
Zenodo integration for ownCloud

Written 2016 by Lars Næsbye Christensen, DeIC

Allows you to send a file or folder to [Zenodo](http://zenodo.org) (production/live or sandbox) from within ownCloud/Nextcloud.
Simply click the 'Zenodo' action button in the filelist.

## Dependencies 
 * ownCloud 7.0.x (not tested with newer)

## Caveats
 * Browsers that do not support the HTML5 input type 'date' (notably Firefox) might have problems sending uniform dates

## Installation instructions
Copy the app files to the **owncloud/apps/** directory and enable it.

## Usage
You set up access tokens in the Zenodo web interface. You can enter these in your user settings.

Admins will want to store client ID and secret in the Admin interface.
