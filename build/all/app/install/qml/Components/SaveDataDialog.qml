/*
 * 2021  Ivo Xavier
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * kaltracker is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */



import QtQuick 2.9
import Ubuntu.Components 1.3
import Ubuntu.Components.Popups 1.3


Dialog {
    id: saveOperationDialog
    property string msg;
    property color  labelColor;
    title: i18n.tr("Operation Result")
    Label{
        text: i18n.tr(msg)
        color: labelColor
    }
    Button {
        text: "Close"
        onClicked:
           PopupUtils.close(saveOperationDialog)
    }
}
