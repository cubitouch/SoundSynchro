﻿/* CodeFluent Generated Tuesday, 22 December 2015 14:46. TargetVersion:Default. Culture:fr-FR. UiCulture:fr-FR. Encoding:utf-8 (http://www.softfluent.com) */
set quoted_identifier OFF
GO
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_NAME = 'vMusic' AND TABLE_SCHEMA = 'dbo')
DROP VIEW [dbo].[vMusic]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_NAME = 'vPlaylist' AND TABLE_SCHEMA = 'dbo')
DROP VIEW [dbo].[vPlaylist]
GO

CREATE VIEW [dbo].[vMusic]
AS
SELECT [Music].[Music_id], [Music].[Music_title], [Music].[Music_file], [Music].[Music_thumbnail], [Music].[Music_date], [Music].[_rowVersion], [Music].[_trackCreationTime], [Music].[_trackLastWriteTime], [Music].[_trackCreationUser], [Music].[_trackLastWriteUser] 
    FROM [Music]
GO

CREATE VIEW [dbo].[vPlaylist]
AS
SELECT [Playlist].[Playlist_id], [Playlist].[Playlist_date], [Playlist].[Playlist_title], [Playlist].[_rowVersion], [Playlist].[_trackCreationTime], [Playlist].[_trackLastWriteTime], [Playlist].[_trackCreationUser], [Playlist].[_trackLastWriteUser] 
    FROM [Playlist]
GO
