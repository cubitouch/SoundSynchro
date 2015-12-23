/* CodeFluent Generated Tuesday, 22 December 2015 14:46. TargetVersion:Sql2008, Sql2012, Sql2014, SqlAzure. Culture:fr-FR. UiCulture:fr-FR. Encoding:utf-8 (http://www.softfluent.com) */
set quoted_identifier OFF
GO
/* no fk for 'FK_Ply_Pla_Pla_Pla', tableName='Playlist_musics_Music' table='null' */
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[FK_Ply_Pla_Pla_Pla]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [FK_Ply_Pla_Pla_Pla]
GO
/* no fk for 'FK_Ply_Mus_Mus_Mus', tableName='Playlist_musics_Music' table='null' */
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[FK_Ply_Mus_Mus_Mus]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [FK_Ply_Mus_Mus_Mus]
GO
